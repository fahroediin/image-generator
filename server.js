import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Helper function untuk convert blob ke base64
async function blobToBase64(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
}

app.post('/generate-images', async (req, res) => {
    const { prompt, apiKey, numberOfImages = 4 } = req.body;

    if (!prompt || !apiKey) {
        return res.status(400).json({ 
            error: 'Prompt dan API Key diperlukan.' 
        });
    }

    // Validasi jumlah gambar (max 8 untuk performa)
    const imageCount = Math.min(Math.max(1, parseInt(numberOfImages)), 8);

    console.log(`\n📝 Prompt: "${prompt}"`);
    console.log(`🎨 Generate ${imageCount} gambar...`);

    try {
        const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
        
        const promises = [];
        
        // Generate gambar sejumlah yang diminta
        for (let i = 0; i < imageCount; i++) {
            const promise = fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: prompt,
                    options: {
                        wait_for_model: true
                    }
                })
            })
            .then(async response => {
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`❌ Error pada gambar ${i + 1}:`, errorText);
                    
                    if (response.status === 401 || response.status === 403) {
                        throw new Error('API Key tidak valid. Dapatkan token dari https://huggingface.co/settings/tokens');
                    }
                    if (response.status === 503) {
                        throw new Error('Model sedang loading. Coba lagi dalam 30 detik.');
                    }
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
                
                const blob = await response.blob();
                const base64 = await blobToBase64(blob);
                console.log(`✅ Gambar ${i + 1}/${imageCount} berhasil`);
                return base64;
            })
            .catch(error => {
                console.error(`⚠️  Gagal generate gambar ${i + 1}:`, error.message);
                return null;
            });
            
            promises.push(promise);
        }

        const results = await Promise.all(promises);
        const images = results.filter(img => img !== null);

        if (images.length === 0) {
            throw new Error('Gagal menghasilkan gambar. Coba lagi dalam beberapa saat.');
        }

        console.log(`🎉 Berhasil: ${images.length}/${imageCount} gambar\n`);
        
        res.json({ 
            images,
            count: images.length,
            requested: imageCount
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        let errorMessage = error.message;
        let statusCode = 500;

        if (error.message.includes('API Key')) {
            statusCode = 401;
        } else if (error.message.includes('Model sedang loading')) {
            statusCode = 503;
        }

        res.status(statusCode).json({ 
            error: errorMessage 
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server berjalan dengan baik',
        model: 'Stable Diffusion XL via Hugging Face'
    });
});

app.listen(port, () => {
    console.log(`\n✅ Server berjalan di http://localhost:${port}`);
    console.log(`🤗 Menggunakan Hugging Face Stable Diffusion XL`);
    console.log(`📌 Dapatkan API Token GRATIS di: https://huggingface.co/settings/tokens`);
    console.log(`💡 Tip: Pilih "Read" access saat membuat token\n`);
});