# 🚀 Panduan Hosting ke GitHub Pages

## Langkah 1: Buat Repository Baru di GitHub

1. Buka https://github.com/new
2. Isi nama repository: **vegetable-classifier-web**
3. Pilih **Public**
4. **JANGAN** centang "Add a README file"
5. Klik "Create repository"

## Langkah 2: Push ke GitHub

Setelah repository dibuat, jalankan command berikut di PowerShell:

```powershell
cd "c:\Users\mriva\OneDrive\Dokumen\New folder\vegetable-classifier-web"

# Tambahkan remote repository (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/vegetable-classifier-web.git

# Push ke GitHub
git push -u origin main
```

**ATAU jika sudah ada remote:**

```powershell
git remote set-url origin https://github.com/USERNAME/vegetable-classifier-web.git
git push -u origin main
```

## Langkah 3: Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik tab **Settings** ⚙️
3. Scroll ke bawah, klik **Pages** di sidebar kiri
4. Di bagian **Source**, pilih:
   - Branch: **main**
   - Folder: **/ (root)**
5. Klik **Save**

## Langkah 4: Tunggu Deploy (2-5 menit)

GitHub akan otomatis build dan deploy website Anda.

## Langkah 5: Akses Website

Website akan tersedia di:
```
https://USERNAME.github.io/vegetable-classifier-web/
```

Ganti **USERNAME** dengan username GitHub Anda.

---

## ✅ Checklist

- [ ] Repository dibuat di GitHub
- [ ] Code di-push ke GitHub
- [ ] GitHub Pages diaktifkan
- [ ] Website bisa diakses

---

## 🔧 Troubleshooting

### Jika muncul error "repository not found":
- Pastikan username di URL sudah benar
- Pastikan repository sudah dibuat

### Jika GitHub Pages tidak muncul:
- Tunggu 2-5 menit setelah setup
- Refresh halaman Settings
- Pastikan branch yang dipilih adalah 'main'

### Jika model tidak load:
- Buka Developer Console (F12)
- Cek error di Console tab
- Pastikan file tfjs_models sudah ke-upload

---

## 📝 Commands Lengkap untuk Copy-Paste

```powershell
# 1. Masuk ke folder project
cd "c:\Users\mriva\OneDrive\Dokumen\New folder\vegetable-classifier-web"

# 2. Tambahkan remote (ganti USERNAME)
git remote add origin https://github.com/USERNAME/vegetable-classifier-web.git

# 3. Push ke GitHub
git push -u origin main
```

---

## 🎉 Selesai!

Setelah semua langkah selesai, website Anda akan online dan bisa diakses dari mana saja!

**Link Website:** https://USERNAME.github.io/vegetable-classifier-web/

---

💡 **Tip:** Bookmark link website Anda untuk akses cepat!
