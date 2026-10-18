# VOLCANO 3D — MENGENAL TANDA-TANDA AKTIVITAS GUNUNG API
### Media Simulasi Edukasi 3D Interaktif & Digital Museum Geologi

Proyek ini dibangun sebagai proyek akademik/tugas mahasiswa dengan memanfaatkan teknologi **HTML5, CSS3, JavaScript modern (ES6+), WebGL, dan Three.js**. Aplikasi ini mendemonstrasikan integrasi interaktif grafika 3D real-time di browser web tanpa memerlukan instalasi plugin tambahan.

---

## 📂 Struktur Proyek

```text
VOLCANO-3D/
│
├── index.html          # Markup semantik antarmuka dan container WebGL
├── style.css           # Styling modern glassmorphism, responsive layout, animatif
├── script.js           # Engine Three.js, state machine, partikel, AI satwa liar, raycaster
│
├── models/             # Direktori model 3D (format .glb / .gltf)
│   ├── gunung-api.glb  # Model utama gunung berapi (fallback prosedural jika tidak ada)
│   ├── pohon.glb       # (Opsional) Model pepohonan
│   ├── rusa.glb        # (Opsional) Model satwa darat
│   ├── burung.glb      # (Opsional) Model satwa terbang
│   └── hewan.glb       # (Opsional) Model satwa kecil
│
├── textures/           # Direktori tekstur partikel & lingkungan
│   ├── smoke.png       # Partikel asap kawah
│   ├── ash.png         # Partikel awan abu piroklastik
│   └── ground.jpg      # Tekstur permukaan tanah
│
├── audio/              # File audio pendukung (jika menggunakan aset eksternal)
│   ├── ambience.mp3    # Suara angin & alam
│   ├── wind.mp3        # Deru angin puncak
│   ├── rumble.mp3      # Gemuruh tremor vulkanik
│   └── eruption.mp3    # Dentuman erupsi
│
└── README.md           # Panduan lengkap proyek akademik
```

---

## 🚀 Cara Menjalankan Proyek di Komputer Lokal

Karena Three.js menggunakan `GLTFLoader` dan Web Audio API untuk memuat aset eksternal, protokol keamanan browser (*Cross-Origin Resource Sharing / CORS*) melarang pemuatan file 3D langsung melalui protokol `file://`. Oleh karena itu, aplikasi harus dijalankan menggunakan lokal server web:

### Metode 1: Menggunakan VS Code Live Server (Direkomendasikan)
1. Buka aplikasi **Visual Studio Code**.
2. Masuk ke menu **Extensions** (`Ctrl+Shift+X` atau `Cmd+Shift+X`), lalu cari dan pasang ekstensi **Live Server** (oleh *Ritwick Dey*).
3. Buka folder `VOLCANO-3D/` di VS Code (**File > Open Folder**).
4. Klik kanan pada file `index.html`, lalu pilih **"Open with Live Server"**.
5. Browser default akan terbuka secara otomatis di alamat `http://127.0.0.1:5500/index.html`.

### Metode 2: Menggunakan Python
Jika memiliki Python terinstal di komputer:
```bash
cd VOLCANO-3D
python -m http.server 8000
```
Buka browser pada: `http://localhost:8000`

### Metode 3: Menggunakan Node.js (npx serve)
```bash
cd VOLCANO-3D
npx serve .
```

---

## 🌋 Penjelasan Model 3D (GLB) & Mekanisme Fallback

Aplikasi ini diprogram untuk membaca model 3D utama pada jalur:
`models/gunung-api.glb`

1. **Jika file `models/gunung-api.glb` tersedia**:
   `GLTFLoader` akan memuat model, secara otomatis melakukan penskalaan dan normalisasi posisi di pusat scene (bounding box center), serta menerapkan bayangan dan material yang sesuai.
2. **Jika file `models/gunung-api.glb` tidak tersedia (Fallback Prosedural)**:
   Aplikasi **TIDAK AKAN CRASH atau blank screen**. Three.js secara otomatis membangun simulasi gunung berapi prosedural lengkap dengan:
   - Kerucut lereng gunung bertingkat (*stratovolcano*)
   - Kawah terbuka dengan lelehan danau lava berpijar
   - Pipa saluran magma vertikal (*vent/conduit*)
   - Kantong dapur magma elipsoid (*magma chamber*)
   - Lapisan batuan strata geologi bertekstur
   - Hutan vegetasi tropis dinamis bergoyang ditiup angin
   - Kawanan satwa liar (rusa, burung elang melingkar, kelinci lereng)
   - Sungai pegunungan mengalir dan stasiun seismik PVMBG

---

## 🎮 Cara Mengganti Model & Menyesuaikan Parameter

### 1. Mengganti Model Gunung:
Cukup simpan file model 3D baru Anda dengan nama `gunung-api.glb` di dalam folder `models/`. Jika menggunakan nama file berbeda, sesuaikan variabel path pada `script.js`:
```javascript
const GLB_VOLCANO_PATH = 'models/nama-model-anda.glb';
```

### 2. Mengatur Posisi Kamera & Preset:
Buka `script.js` dan cari fungsi preset kamera:
```javascript
function setCameraPreset(preset) {
  if (preset === 'overview') {
    camera.position.set(0, 18, 38);
    controls.target.set(0, 6, 0);
  } else if (preset === 'crater') {
    camera.position.set(0, 19, 13);
    controls.target.set(0, 14.2, 0);
  }
}
```

### 3. Mengatur Sistem Partikel Lava & Abu:
Pada `script.js`, cari fungsi `createSmoke()` dan `createAsh()`. Anda dapat mengubah jumlah partikel (`particleCount`), kecepatan naik, dan warna emisi sesuai kebutuhan presentasi.

---

## 🦌 Sistem Respon Perilaku Satwa Liar (State Machine)

Aplikasi memiliki mesin status (*finite state machine*) yang menghubungkan aktivitas geologi dengan perilaku fauna:

| Status | Gunung & Seismograf | Perilaku Rusa | Perilaku Burung | Perilaku Hewan Kecil |
| :--- | :--- | :--- | :--- | :--- |
| **NORMAL** | Gempa kecil, asap tipis | Berjalan santai & merumput | Terbang melingkar santai | Bergerak di semak |
| **WARNING** | Tremor naik, asap tebal, suhu naik | Berhenti mendadak & waspada | Terbang lebih tinggi menjauh | Bergerak cepat |
| **ERUPTION** | Letusan besar, dentuman, lava mengalir | Berlari kencang ke zona aman | Membumbung tinggi keluar scene | Masuk ke liang tanah |

Pergerakan satwa menggunakan interpolasi vektor halus (`Vector3.lerp()`) sehingga gerakan tampak alami tanpa teleportasi mendadak.

---

## 🔊 Sistem Audio

Aplikasi mengintegrasikan **Web Audio API** prosedural yang menghasilkan:
- Desau angin pegunungan (synthesized pink/white noise)
- Gemuruh getaran sub-bass seismik saat aktivitas meningkat
- Dentuman eksplosif dengan *pitch ramp* saat fase erupsi terjadi
Aplikasi juga siap menerima file audio MP3 eksternal jika diletakkan di folder `audio/`.

---

## ⚠️ Disclaimer Edukasi

Visualisasi ini dirancang murni untuk tujuan pembelajaran akademis, simulasi konsep geologi, dan pemahaman publik mengenai prinsip vulkanologi. Visualisasi ini **bukan merupakan sistem pemantauan atau prediksi bencana real-time**. Status resmi gunung api di Indonesia mengacu secara mutlak pada rilis berkala Badan Geologi / Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG).

---

© 2026 Volcano 3D Project — Dikembangkan dengan HTML5 • WebGL • Three.js.
