document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const apiKeyModal = document.getElementById('api-key-modal');
    const apiKeyForm = document.getElementById('api-key-form');
    const apiKeyInput = document.getElementById('api-key-input');
    const mainContent = document.getElementById('main-content');
    const logoutBtn = document.getElementById('logout-btn');
    const promptForm = document.getElementById('prompt-form');
    const promptInput = document.getElementById('prompt-input');
    const gallery = document.getElementById('image-gallery');
    const generateBtn = document.getElementById('generate-btn');
    const btnText = generateBtn.querySelector('.btn-text');
    const spinner = generateBtn.querySelector('.spinner');
    
    // Image count elements
    const imageCountSlider = document.getElementById('image-count');
    const countDisplay = document.getElementById('count-display');
    const countButtons = document.querySelectorAll('.count-btn');

    const STORAGE_KEY = 'HF_API_TOKEN';

    // --- Helper Functions ---
    const setLoading = (isLoading) => {
        generateBtn.disabled = isLoading;
        btnText.style.display = isLoading ? 'none' : 'block';
        spinner.style.display = isLoading ? 'block' : 'none';
        promptInput.disabled = isLoading;
        imageCountSlider.disabled = isLoading;
        countButtons.forEach(btn => btn.disabled = isLoading);
    };

    const updateCountDisplay = (value) => {
        countDisplay.textContent = value;
        
        // Update active button
        countButtons.forEach(btn => {
            if (btn.dataset.value === value.toString()) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    };

    const displayImages = (images, prompt) => {
        gallery.innerHTML = '';
        
        if (images && images.length > 0) {
            images.forEach((base64Image, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.style.position = 'relative';
                
                const imgElement = document.createElement('img');
                imgElement.src = `data:image/jpeg;base64,${base64Image}`;
                imgElement.alt = `${prompt} - Image ${index + 1}`;
                imgElement.loading = 'lazy';
                
                // Download button
                const downloadBtn = document.createElement('button');
                downloadBtn.innerHTML = '💾';
                downloadBtn.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    opacity: 0;
                    transition: opacity 0.3s, transform 0.2s;
                    z-index: 10;
                `;
                
                downloadBtn.onmouseover = () => {
                    downloadBtn.style.transform = 'scale(1.1)';
                };
                downloadBtn.onmouseout = () => {
                    downloadBtn.style.transform = 'scale(1)';
                };
                
                downloadBtn.onclick = (e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = imgElement.src;
                    link.download = `ai-image-${index + 1}-${Date.now()}.jpg`;
                    link.click();
                };
                
                imgContainer.onmouseenter = () => downloadBtn.style.opacity = '1';
                imgContainer.onmouseleave = () => downloadBtn.style.opacity = '0';
                
                // Touch support for mobile
                imgContainer.onclick = () => {
                    downloadBtn.style.opacity = downloadBtn.style.opacity === '1' ? '0' : '1';
                };
                
                imgContainer.appendChild(imgElement);
                imgContainer.appendChild(downloadBtn);
                gallery.appendChild(imgContainer);
            });
        } else {
            gallery.innerHTML = '<div class="placeholder">Tidak ada gambar yang dihasilkan. Coba prompt lain.</div>';
        }
    };

    const checkApiKey = () => {
        const savedApiKey = localStorage.getItem(STORAGE_KEY);
        if (savedApiKey && savedApiKey.startsWith('hf_')) {
            apiKeyModal.classList.add('hidden');
            mainContent.classList.remove('hidden');
            return true;
        } else {
            apiKeyModal.classList.remove('hidden');
            mainContent.classList.add('hidden');
            return false;
        }
    };

    // --- Event Listeners ---
    
    // Image count slider
    imageCountSlider.addEventListener('input', (e) => {
        updateCountDisplay(e.target.value);
    });

    // Quick select buttons
    countButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value;
            imageCountSlider.value = value;
            updateCountDisplay(value);
        });
    });

    // API Key form
    apiKeyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey.startsWith('hf_')) {
            alert('❌ Token Hugging Face harus dimulai dengan "hf_"\n\nDapatkan token di: https://huggingface.co/settings/tokens');
            return;
        }
        
        if (apiKey) {
            localStorage.setItem(STORAGE_KEY, apiKey);
            apiKeyInput.value = '';
            checkApiKey();
        }
    });

    // Logout button
    logoutBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin menghapus token dan memasukkan yang baru?')) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    });

    // Generate form
    promptForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const apiKey = localStorage.getItem(STORAGE_KEY);
        if (!apiKey) {
            alert('Token tidak ditemukan. Silakan masukkan token Anda.');
            checkApiKey();
            return;
        }

        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Silakan masukkan prompt terlebih dahulu.');
            return;
        }

        const numberOfImages = parseInt(imageCountSlider.value);

        setLoading(true);
        gallery.innerHTML = `
            <div class="placeholder">
                🎨 Menghubungi Hugging Face API...<br>
                <small style="opacity: 0.7; margin-top: 10px; display: block;">
                    Generating ${numberOfImages} image${numberOfImages > 1 ? 's' : ''} dengan Stable Diffusion XL<br>
                    Estimasi waktu: ${numberOfImages * 5}-${numberOfImages * 10} detik...
                </small>
            </div>
        `;

        try {
            const response = await fetch('http://localhost:3000/generate-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt, 
                    apiKey,
                    numberOfImages 
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Terjadi kesalahan pada server.');
            }
            
            displayImages(result.images, prompt);
            
            // Show success/warning message
            if (result.count < result.requested) {
                const warningDiv = document.createElement('div');
                warningDiv.className = 'placeholder';
                warningDiv.style.cssText = 'background: rgba(255,165,0,0.1); border: 1px solid rgba(255,165,0,0.3); margin-bottom: 20px;';
                warningDiv.innerHTML = `
                    ⚠️ Berhasil generate ${result.count} dari ${result.requested} gambar. Beberapa request gagal.
                `;
                gallery.insertBefore(warningDiv, gallery.firstChild);
            } else {
                const successDiv = document.createElement('div');
                successDiv.className = 'placeholder';
                successDiv.style.cssText = 'background: rgba(0,255,0,0.1); border: 1px solid rgba(0,255,0,0.3); margin-bottom: 20px;';
                successDiv.innerHTML = `
                    ✅ Berhasil generate ${result.count} gambar!
                `;
                gallery.insertBefore(successDiv, gallery.firstChild);
                
                // Auto hide success message after 3 seconds
                setTimeout(() => {
                    successDiv.style.transition = 'opacity 0.5s';
                    successDiv.style.opacity = '0';
                    setTimeout(() => successDiv.remove(), 500);
                }, 3000);
            }

        } catch (error) {
            console.error('Error:', error);
            
            let errorHTML = `
                <div class="placeholder" style="background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.3);">
                    ❌ ${error.message}
                </div>
            `;
            
            // Add helpful tips based on error
            if (error.message.includes('API Key') || error.message.includes('token')) {
                errorHTML += `
                    <div class="placeholder" style="margin-top: 10px;">
                        💡 <strong>Cara mendapatkan token:</strong><br>
                        1. Kunjungi <a href="https://huggingface.co/settings/tokens" target="_blank" style="color: var(--primary-color);">huggingface.co/settings/tokens</a><br>
                        2. Klik "New token"<br>
                        3. Pilih "Read" access<br>
                        4. Copy token yang dimulai dengan "hf_"
                    </div>
                `;
            } else if (error.message.includes('Model sedang loading')) {
                errorHTML += `
                    <div class="placeholder" style="margin-top: 10px;">
                        ⏳ Model Stable Diffusion XL sedang warming up.<br>
                        <small>Ini normal untuk pertama kali. Coba lagi dalam 30-60 detik.</small>
                    </div>
                `;
            } else if (error.message.includes('fetch')) {
                errorHTML += `
                    <div class="placeholder" style="margin-top: 10px;">
                        🔌 Gagal menghubungi server.<br>
                        <small>Pastikan server berjalan di http://localhost:3000</small>
                    </div>
                `;
            }
            
            gallery.innerHTML = errorHTML;
        } finally {
            setLoading(false);
        }
    });
    
    // --- Initialization ---
    updateCountDisplay(imageCountSlider.value);
    
    if (checkApiKey()) {
        promptInput.focus();
    } else {
        apiKeyInput.focus();
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !generateBtn.disabled) {
            promptForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Add tooltip to prompt input
    promptInput.addEventListener('focus', function() {
        if (!this.value) {
            this.placeholder = 'Tips: Semakin detail deskripsi Anda, semakin bagus hasilnya. Gunakan bahasa Inggris untuk hasil optimal.';
        }
    });
    
    promptInput.addEventListener('blur', function() {
        if (!this.value) {
            this.placeholder = 'Contoh: A majestic dragon flying over a mystical mountain landscape at sunset, highly detailed, fantasy art style';
        }
    });
});