# Wuizzizzz - Quiz Platform

Platform quiz interaktif untuk persiapan SGC 2026 dengan berbagai fitur menarik.

## Fitur Utama
- **3 Paket Soal** dengan tingkat kesulitan berbeda
- **Mode Tebus Dosa** untuk memperbaiki kesalahan
- **Timer Interaktif** dengan animasi
- **Responsive Design** untuk semua perangkat
- **Peringkat Otomatis** dengan level prestasi
- **Confetti Celebration** untuk momen kemenangan
- **Local Storage** untuk penyimpanan skor

## Struktur Folder
```

wuizzizzz/
├── index.html          # Halaman utama
├── css/
│   └── style.css      # Semua styling
├── js/
│   ├── main.js        # Logika utama aplikasi
│   ├── questions.js   # Manajemen soal
│   └── utils.js       # Fungsi utilitas
├── questions/         # Folder paket soal
│   ├── 1.json        # Paket Basic
│   ├── 2.json        # Paket Medium
│   └── 3.json        # Paket Advanced
└── README.md          # Dokumentasi

```

## Cara Menggunakan
1. Buka `index.html` di browser
2. Masukkan nama dan pilih paket soal
3. Baca petunjuk di dropdown tutorial
4. Jawab soal dalam waktu 60 detik
5. Periksa jawaban dan lanjutkan
6. Lihat hasil akhir di papan peringkat
7. Gunakan mode tebus dosa untuk soal yang salah

## Teknologi yang Digunakan
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS untuk styling
- Canvas Confetti untuk efek visual
- LocalStorage untuk penyimpanan data
- Fetch API untuk load soal

## Customisasi
1. **Soal**: Edit file JSON di folder `questions/`
2. **Styling**: Edit `css/style.css` atau class Tailwind di `index.html`
3. **Logika**: Edit file JavaScript di folder `js/`
4. **Paket Soal**: Tambahkan entry baru di `js/questions.js`

## Kontribusi
Dikembangkan oleh ZAM ZAM untuk semua.

## Versi
v0.0.3 - Added multi-package system and improved UI
```

10. Cara Deploy ke GitHub Pages

1. Buat repository baru di GitHub dengan nama wuizzizzz
2. Clone repository ke komputer lokal:
   ```bash
   git clone https://github.com/zroeo/quiz-website.git
   cd wuizzizzz
   ```
3. Salin semua file yang telah dibuat ke dalam folder ini
4. Tambahkan, commit, dan push ke GitHub:
   ```bash
   git add .
   git commit -m "Initial commit: Wuizzizzz quiz platform"
   git push origin main
   ```
5. Aktifkan GitHub Pages:
   · Pergi ke repository settings
   · Scroll ke bagian "GitHub Pages"
   · Pilih branch main dan folder /root
   · Simpan perubahan
6. Akses aplikasi di: https://username.github.io/quiz-website/
