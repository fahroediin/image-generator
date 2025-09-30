# 🎨 AI Image Generator - Hugging Face Edition

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

**Generate stunning AI images using Stable Diffusion XL via Hugging Face API**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-reference)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Tips & Tricks](#-tips--tricks)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

AI Image Generator adalah aplikasi web modern yang memungkinkan Anda menghasilkan gambar berkualitas tinggi dari deskripsi teks menggunakan model **Stable Diffusion XL** melalui Hugging Face API. Aplikasi ini dibangun dengan Express.js backend dan vanilla JavaScript frontend, dengan desain yang fully responsive dan user-friendly.

### Why This Project?

- ✅ **100% Free** - Menggunakan Hugging Face API yang gratis
- ✅ **No Sign Up Required** - User hanya perlu token API (gratis)
- ✅ **Privacy First** - Token disimpan di browser, tidak di server
- ✅ **Fast & Efficient** - Generate hingga 8 gambar sekaligus
- ✅ **Fully Responsive** - Bekerja sempurna di desktop, tablet, dan mobile

---

## ✨ Features

### 🎯 Core Features
- **Text-to-Image Generation** menggunakan Stable Diffusion XL
- **Flexible Image Count** - Generate 1-8 gambar sekaligus
- **Interactive Slider** dengan quick-select buttons
- **Real-time Progress** indicator dengan estimasi waktu
- **Download Individual Images** dengan satu klik
- **Secure Token Storage** di browser (localStorage)

### 🎨 UI/UX Features
- **Dark Mode Design** yang modern dan elegan
- **Fully Responsive** - Mobile, tablet, dan desktop
- **Smooth Animations** dan transitions
- **Keyboard Shortcuts** (Ctrl+Enter untuk generate)
- **Auto-focus** pada input fields
- **Error Handling** yang informatif
- **Success/Warning Messages** dengan auto-hide

### 📱 Mobile Optimized
- Touch-friendly buttons dan controls
- Optimized grid layout untuk layar kecil
- Swipe-friendly image gallery
- Compact modal design

---

## 🎬 Demo

### Desktop View
![Desktop Demo](https://via.placeholder.com/800x450/1e1e1e/8a2be2?text=Desktop+View)

### Mobile View
![Mobile Demo](https://via.placeholder.com/400x800/1e1e1e/8a2be2?text=Mobile+View)

### Generated Images
![Sample Output](https://via.placeholder.com/600x300/1e1e1e/8a2be2?text=AI+Generated+Images)

---

## 📦 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** v14.0.0 atau lebih tinggi
- **npm** atau **yarn** package manager
- **Hugging Face Account** (gratis) untuk mendapatkan API token
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-image-generator.git
cd ai-image-generator
```

### 2. Install Dependencies

```bash
npm install
```

atau dengan yarn:

```bash
yarn install
```

### 3. Start Server

```bash
npm start
```

atau untuk development dengan auto-reload:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## ⚙️ Configuration

### Mendapatkan Hugging Face Token

1. **Daftar/Login** ke [Hugging Face](https://huggingface.co/)
2. Buka [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Klik **"New token"**
4. Beri nama token (contoh: "Image Generator")
5. Pilih **"Read"** access
6. Klik **"Generate token"**
7. Copy token (dimulai dengan `hf_...`)

### Environment Variables (Opsional)

Buat file `.env` di root folder:

```env
PORT=3000
NODE_ENV=production
```

---

## 💻 Usage

### Basic Usage

1. **Buka Browser**
   ```
   http://localhost:3000
   ```

2. **Masukkan Token**
   - Paste Hugging Face token Anda
   - Token akan disimpan di browser

3. **Generate Images**
   - Tulis prompt dalam bahasa Inggris
   - Pilih jumlah gambar (1-8)
   - Klik "Generate Images" atau tekan `Ctrl+Enter`

4. **Download Images**
   - Hover pada gambar
   - Klik icon 💾 untuk download

### Advanced Usage

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Generate images |
| `Tab` | Navigate between inputs |

#### Quick Select Buttons

Gunakan button 1, 2, 4, 6, atau 8 untuk cepat memilih jumlah gambar tanpa slider.

---

## 📁 Project Structure

```
ai-image-generator/
├── server.js              # Express server & API logic
├── index.html             # Main HTML file
├── style.css              # Responsive CSS styling
├── script.js              # Frontend JavaScript
├── package.json           # Dependencies & scripts
├── README.md              # Documentation
└── .gitignore            # Git ignore rules
```

### File Descriptions

- **server.js**: Backend server dengan Express.js, menangani API calls ke Hugging Face
- **index.html**: Frontend HTML dengan modal untuk token input
- **style.css**: Responsive dark mode styling dengan custom CSS variables
- **script.js**: Frontend logic untuk UI interactions dan API calls

---

## 🔌 API Reference

### POST `/generate-images`

Generate images dari text prompt.

#### Request Body

```json
{
  "prompt": "A majestic dragon flying over mountains",
  "apiKey": "hf_xxxxxxxxxxxxxxxxxxxx",
  "numberOfImages": 4
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Text description untuk generate gambar |
| `apiKey` | string | Yes | - | Hugging Face API token |
| `numberOfImages` | number | No | 4 | Jumlah gambar (1-8) |

#### Response

**Success (200)**
```json
{
  "images": ["base64string1", "base64string2", ...],
  "count": 4,
  "requested": 4
}
```

**Error (4xx/5xx)**
```json
{
  "error": "Error message description"
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success - Images generated |
| 400 | Bad Request - Missing parameters |
| 401 | Unauthorized - Invalid API key |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Model loading |

### GET `/health`

Check server status.

#### Response

```json
{
  "status": "OK",
  "message": "Server berjalan dengan baik",
  "model": "Stable Diffusion XL via Hugging Face"
}
```

---

## 💡 Tips & Tricks

### Writing Better Prompts

#### ✅ Good Prompts

```
"A cyberpunk samurai with glowing katana, neon city background, 
rain effects, cinematic lighting, highly detailed, 8k quality"

"Portrait of a magical forest fairy with butterfly wings, 
surrounded by glowing mushrooms and fireflies, ethereal atmosphere, 
soft bokeh, fantasy art style by James Gurney"

"Futuristic sports car with sleek design, chrome finish, 
LED lights, desert highway at sunset, dramatic clouds, 
photorealistic, ultra HD"
```

#### ❌ Bad Prompts

```
"gambar bagus"
"make something cool"
"buatkan kucing"
```

### Prompt Structure Tips

1. **Subject** - What is the main focus?
2. **Description** - Detailed attributes
3. **Setting** - Background/environment
4. **Style** - Art style, lighting, quality
5. **Artist Reference** (optional) - "in the style of..."

### Best Practices

- 🌐 **Use English** - Model trained primarily on English
- 📝 **Be Specific** - More details = better results
- 🎨 **Add Style Keywords** - "photorealistic", "oil painting", "anime style"
- 💡 **Include Lighting** - "cinematic lighting", "golden hour", "neon glow"
- 📏 **Mention Quality** - "highly detailed", "8k", "ultra HD"

### Performance Tips

- Start with **2-4 images** untuk testing
- Use **shorter prompts** untuk faster generation
- **Model loading** pertama kali butuh 30-60 detik (normal)
- Generate pada **off-peak hours** untuk response lebih cepat

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Model sedang loading"

**Problem**: First-time model initialization

**Solution**: 
- Wait 30-60 seconds
- Try again
- This is normal for cold start

#### 2. "API Key tidak valid"

**Problem**: Invalid or incorrect token

**Solution**:
- Check token starts with `hf_`
- Generate new token at [Hugging Face](https://huggingface.co/settings/tokens)
- Ensure "Read" access is selected

#### 3. "Gagal menghasilkan gambar"

**Problem**: Network or API issues

**Solution**:
- Check internet connection
- Verify server is running (`http://localhost:3000/health`)
- Try reducing number of images
- Check Hugging Face API status

#### 4. Images tidak muncul

**Problem**: Base64 encoding error

**Solution**:
- Clear browser cache
- Try different browser
- Check browser console for errors

#### 5. Server tidak bisa diakses dari mobile

**Problem**: Localhost only accessible on same device

**Solution**:
```bash
# Find your computer's IP address
# Windows
ipconfig

# Mac/Linux
ifconfig

# Access from mobile using:
http://YOUR_IP_ADDRESS:3000
```

### Debug Mode

Enable logging di `server.js`:

```javascript
// Add at top of server.js
const DEBUG = true;

if (DEBUG) console.log('Debug info:', data);
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🌐 Translations
- ⚡ Performance optimizations

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

```
Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

- **Hugging Face** - For providing free API access
- **Stability AI** - For Stable Diffusion XL model
- **Express.js** - Backend framework
- **Google Fonts** - Inter font family

---

## 📞 Contact & Support

### Author

- **Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

### Support

- 🐛 [Report Bugs](https://github.com/yourusername/ai-image-generator/issues)
- 💬 [Discussions](https://github.com/yourusername/ai-image-generator/discussions)
- ⭐ Star this repo if you find it helpful!

---

## 🗺️ Roadmap

### Version 1.1 (Coming Soon)

- [ ] Multiple model support (DALL-E, Midjourney)
- [ ] Image editing capabilities
- [ ] Prompt history and favorites
- [ ] Batch download (ZIP)
- [ ] Image upscaling feature

### Version 1.2 (Future)

- [ ] User authentication
- [ ] Cloud storage integration
- [ ] Social sharing features
- [ ] Advanced filters and effects
- [ ] Prompt templates library

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-image-generator?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-image-generator?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/ai-image-generator?style=social)

---

<div align="center">

**Made with ❤️ by [Your Name]**

[⬆ Back to Top](#-ai-image-generator---hugging-face-edition)

</div>