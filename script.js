// Data penyimpanan di LocalStorage. Mengambil data yang sudah ada atau array kosong.
let suratMasuk = JSON.parse(localStorage.getItem('suratMasuk')) || [];
let suratKeluar = JSON.parse(localStorage.getItem('suratKeluar')) || [];

// --- Bagian I: Fungsi Inti Aplikasi ---

/**
 * Menyimpan data ke LocalStorage dan memperbarui tampilan UI (Statistik & Tabel).
 */
function updateDataAndUI() {
    // 1. Simpan ke LocalStorage
    localStorage.setItem('suratMasuk', JSON.stringify(suratMasuk));
    localStorage.setItem('suratKeluar', JSON.stringify(suratKeluar));
    
    // 2. Perbarui Tampilan (Statistik)
    updateStats();
    
    // 3. Perbarui Tampilan (Tabel)
    renderSuratTables();
}

/**
 * Menampilkan data surat ke tabel di halaman "Lihat Semua Surat".
 */
function renderSuratTables() {
    // ... (Logika render tabel, sama seperti sebelumnya) ...
    const tbodyMasuk = document.querySelector('#tabel-masuk tbody');
    const tbodyKeluar = document.querySelector('#tabel-keluar tbody');
    
    // Hapus baris yang ada
    tbodyMasuk.innerHTML = '';
    tbodyKeluar.innerHTML = '';

    // Render Surat Masuk
    suratMasuk.forEach((surat, index) => {
        const row = tbodyMasuk.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = surat.noSurat;
        row.insertCell(2).textContent = surat.asal;
        row.insertCell(3).textContent = surat.tanggal;
        row.insertCell(4).textContent = surat.perihal;
    });

    // Render Surat Keluar
    suratKeluar.forEach((surat, index) => {
        const row = tbodyKeluar.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = surat.noSurat;
        row.insertCell(2).textContent = surat.tujuan;
        row.insertCell(3).textContent = surat.tanggal;
        row.insertCell(4).textContent = surat.perihal;
    });
}

/**
 * Memperbarui angka statistik di halaman Beranda (count-masuk/keluar) dan badge.
 */
function updateStats() {
    // Pastikan ID ini sesuai dengan di index.html
    const countMasukEl = document.getElementById('count-masuk');
    const countKeluarEl = document.getElementById('count-keluar');
    const badgeMasukEl = document.getElementById('badge-masuk');
    const badgeKeluarEl = document.getElementById('badge-keluar');
    
    if (countMasukEl) countMasukEl.textContent = suratMasuk.length;
    if (countKeluarEl) countKeluarEl.textContent = suratKeluar.length;
    if (badgeMasukEl) badgeMasukEl.textContent = suratMasuk.length;
    if (badgeKeluarEl) badgeKeluarEl.textContent = suratKeluar.length;
}

// --- Bagian II: Logic Login & Logout ---

/**
 * Fungsi untuk menangani proses logout.
 */
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    document.getElementById('dashboard-page').classList.remove('active');
    document.getElementById('dashboard-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('login-page').classList.add('active');
    
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Listener untuk Tombol Login
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kredensial sederhana: 'admin' dan 'admin'
    if (username === 'admin' && password === 'adbang') {
        // Transisi Halaman: Login ke Dashboard
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('dashboard-page').classList.remove('hidden');
        document.getElementById('dashboard-page').classList.add('hidden');
        
        sessionStorage.setItem('isLoggedIn', 'true');

        // Panggil fungsi inisialisasi dan update
        updateDataAndUI();
    } else {
        alert('Login Gagal! Username atau Password salah. (Petunjuk: Gunakan admin/admin)');
    }
});


// --- Bagian III: Logic Navigasi & Form Submit ---

// Navigasi Sidebar
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const targetId = e.target.closest('button').dataset.target;

        // Reset semua tombol nav
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
        e.target.closest('button').classList.add('active-nav');

        // Sembunyikan semua section konten
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active-section');
        });

        // Tampilkan section yang dituju
        document.getElementById(targetId).classList.add('active-section');

        // Jika pindah ke Beranda atau Lihat Surat, update data
        if (targetId === 'lihat-surat' || targetId === 'beranda') {
            updateDataAndUI(); 
        }
    });
});

// 4. Submit Form Surat Masuk
document.getElementById('form-masuk').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newSurat = {
        noSurat: document.getElementById('no-masuk').value,
        asal: document.getElementById('asal-surat').value,
        tanggal: document.getElementById('tgl-masuk').value,
        perihal: document.getElementById('perihal-masuk').value,
        jenis: 'masuk',
        timestamp: new Date().toISOString()
    };
    
    suratMasuk.push(newSurat);
    updateDataAndUI(); // Panggil update agar Beranda langsung terupdate!

    alert('Surat Masuk Berhasil Disimpan!');
    e.target.reset(); 
});

// 5. Submit Form Surat Keluar
document.getElementById('form-keluar').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newSurat = {
        noSurat: document.getElementById('no-keluar').value,
        tujuan: document.getElementById('tujuan-surat').value,
        tanggal: document.getElementById('tgl-keluar').value,
        perihal: document.getElementById('perihal-keluar').value,
        jenis: 'keluar',
        timestamp: new Date().toISOString()
    };
    
    suratKeluar.push(newSurat);
    updateDataAndUI(); // Panggil update agar Beranda langsung terupdate!

    alert('Surat Keluar Berhasil Disimpan!');
    e.target.reset(); 
});


// --- Bagian IV: Inisialisasi ---

/**
 * Mengecek status login saat halaman dimuat (untuk mencegah login berulang).
 */
function checkLoginStatus() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        // Langsung tampilkan dashboard
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('dashboard-page').classList.remove('hidden');
        document.getElementById('dashboard-page').classList.add('active');
        updateDataAndUI(); // Panggil update agar statistik tampil segera
    } 
    // Jika belum login, biarkan login-page tetap 'active' (default HTML)
}

// Panggil fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', checkLoginStatus);