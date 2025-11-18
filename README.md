# 🥬 Vegetable AI Classifier

> **Sistem Klasifikasi Sayuran Otomatis dengan Teknologi Deep Learning**

Web aplikasi modern untuk klasifikasi gambar sayuran menggunakan TensorFlow.js. Aplikasi ini dapat mengenali 15 jenis sayuran secara real-time langsung di browser, tanpa memerlukan server backend.

[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.20.0-FF6F00?logo=tensorflow)](https://www.tensorflow.org/js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://rivaldy-25-lval.github.io/Valll-vegetable-classifier-web/)

## ✨ Fitur Utama

- 🎯 **Akurasi Tinggi**: Model Deep Learning terlatih untuk 15 jenis sayuran
- ⚡ **Real-time Processing**: Klasifikasi langsung di browser tanpa server
- 📱 **Responsive Design**: Tampilan optimal di desktop, tablet, dan mobile
- 🎨 **UI/UX Modern**: Desain elegan dengan animasi halus
- 🔒 **Privacy First**: Semua pemrosesan dilakukan secara lokal di browser
- 📊 **Detailed Results**: Tampilan Top-5 prediksi dengan confidence score

## 🌿 Sayuran yang Dikenali

Aplikasi ini dapat mengklasifikasikan 15 jenis sayuran:

| Sayuran | Emoji | Sayuran | Emoji |
|---------|-------|---------|-------|
| Bean | 🫘 | Broccoli | 🥦 |
| Bitter Gourd | 🥒 | Cabbage | 🥬 |
| Bottle Gourd | 🍈 | Capsicum | 🫑 |
| Brinjal (Eggplant) | 🍆 | Carrot | 🥕 |
| Cauliflower | 🥦 | Cucumber | 🥒 |
| Papaya | 🍈 | Potato | 🥔 |
| Pumpkin | 🎃 | Radish | 🌰 |
| Tomato | 🍅 | | |

## 📁 Struktur Proyek

```
vegetable-classifier-web/
├── index.html              # Halaman utama aplikasi
├── css/
│   └── style.css          # Styling dengan desain modern
├── js/
│   └── script.js          # Logika aplikasi & TensorFlow.js
├── tfjs_models/           # Model TensorFlow.js
│   ├── model.json         # Model architecture & metadata
│   ├── group1-shard1of2.bin
│   └── group1-shard2of2.bin
├── assets/                # Aset tambahan (opsional)
├── README.md              # Dokumentasi
├── DEPLOY_GUIDE.md        # Panduan deployment
└── .gitignore
```

## 🚀 Cara Menggunakan

### Online (GitHub Pages)

Kunjungi demo live: [https://rivaldy-25-lval.github.io/Valll-vegetable-classifier-web/](https://rivaldy-25-lval.github.io/Valll-vegetable-classifier-web/)

### Lokal (Development)

1. **Clone Repository**
   ```bash
   git clone https://github.com/Rivaldy-25-Lval/Valll-vegetable-classifier-web.git
   cd Valll-vegetable-classifier-web
   ```

2. **Jalankan Local Server**
   
   Gunakan salah satu metode berikut:

   **Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Node.js (http-server):**
   ```bash
   npx http-server -p 8000
   ```

   **VS Code Live Server:**
   - Install extension "Live Server"
   - Klik kanan pada `index.html` → "Open with Live Server"

3. **Buka di Browser**
   ```
   http://localhost:8000
   ```

## 💡 Cara Kerja

1. **Upload Gambar**: Pilih atau drag & drop gambar sayuran (JPG, PNG, WebP)
2. **Preprocessing**: Gambar otomatis di-resize ke 128×128 piksel dan dinormalisasi
3. **Inference**: Model TensorFlow.js melakukan prediksi
4. **Hasil**: Tampilan nama sayuran dengan confidence score dan Top-5 prediksi

## 🛠️ Teknologi

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **Machine Learning**: TensorFlow.js 4.20.0
- **Styling**: CSS3 dengan Custom Properties & Animations
- **Architecture**: Sequential CNN (Convolutional Neural Network)
  - Input: 128×128×3 (RGB image)
  - Layers: 4× Conv2D + MaxPooling + Flatten + Dense
  - Output: 15 classes (softmax)

## 📦 Model Information

- **Format**: TensorFlow.js Layers Model
- **Input Shape**: `[batch, 128, 128, 3]`
- **Output Shape**: `[batch, 15]`
- **Total Parameters**: ~1.2M
- **Model Size**: ~4.5MB
- **Framework**: Keras → TensorFlow.js Converter

## 🎨 Desain & UI/UX

- **Color Scheme**: Gradient modern (Purple to Pink)
- **Typography**: Inter (body) & Poppins (headings)
- **Animations**: Smooth transitions & keyframe animations
- **Responsive Breakpoints**: 480px, 768px, 1200px
- **Accessibility**: Semantic HTML & ARIA labels

## 🔧 Pengembangan

### Prerequisites
- Browser modern (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime, etc.)
- Local server (Python, Node.js, atau VS Code Live Server)

### Testing
1. Test dengan berbagai gambar sayuran
2. Periksa DevTools → Console untuk logs
3. Verifikasi Network → model.json & shards berhasil dimuat

### Debugging
Akses debug utilities di browser console:
```javascript
window.VegetableClassifier.logMemoryUsage()  // Cek penggunaan memory TensorFlow.js
window.VegetableClassifier.CONFIG            // Lihat konfigurasi
```

## 🌐 Deployment ke GitHub Pages

Lihat [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) untuk instruksi lengkap deployment ke GitHub Pages.

**Quick Deploy:**
```bash
git add .
git commit -m "Deploy vegetable classifier"
git push origin main
```

Kemudian aktifkan GitHub Pages di: **Settings → Pages → Source: main / root**

## 📄 License

MIT License - silakan gunakan dan modifikasi sesuai kebutuhan.

## 👨‍💻 Author

**Muhammad Rivaldy Pratama**

- GitHub: [@Rivaldy-25-Lval](https://github.com/Rivaldy-25-Lval)

## 🙏 Acknowledgments

- TensorFlow.js team untuk framework yang powerful
- Google Fonts untuk typography
- Komunitas open source

---

**Made with ❤️ and TensorFlow.js**
