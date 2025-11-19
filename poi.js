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
    
    // 3. Perbarui Tampilan (Tabel) - Render semua data (tanpa filter)
    renderSuratTables(suratMasuk, suratKeluar); 
}

/**
 * Menampilkan data surat ke tabel di halaman "Lihat Semua Surat".
 */
function renderSuratTables(dataMasuk = suratMasuk, dataKeluar = suratKeluar) {
    const tbodyMasuk = document.querySelector('#tabel-masuk tbody');
    const tbodyKeluar = document.querySelector('#tabel-keluar tbody');
    
    tbodyMasuk.innerHTML = '';
    tbodyKeluar.innerHTML = '';

    // Render Surat Masuk
    dataMasuk.forEach((surat, index) => {
        const row = tbodyMasuk.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = surat.noSurat;
        row.insertCell(2).textContent = surat.asal;
        row.insertCell(3).textContent = surat.tanggal;
        row.insertCell(4).textContent = surat.perihal;
        
        // Tambah tombol HAPUS
        const actionCell = row.insertCell(5);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.classList.add('btn', 'danger-btn', 'btn-small');
        
        // Cari index asli menggunakan timestamp (ID unik)
        const originalIndex = suratMasuk.findIndex(s => s.timestamp === surat.timestamp);
        deleteButton.onclick = () => deleteSurat(originalIndex, 'masuk');
        actionCell.appendChild(deleteButton);
    });

    // Render Surat Keluar
    dataKeluar.forEach((surat, index) => {
        const row = tbodyKeluar.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = surat.noSurat;
        row.insertCell(2).textContent = surat.tujuan;
        row.insertCell(3).textContent = surat.tanggal;
        row.insertCell(4).textContent = surat.perihal;

        // Tambah tombol HAPUS
        const actionCell = row.insertCell(5);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.classList.add('btn', 'danger-btn', 'btn-small');
        
        // Cari index asli menggunakan timestamp (ID unik)
        const originalIndex = suratKeluar.findIndex(s => s.timestamp === surat.timestamp);
        deleteButton.onclick = () => deleteSurat(originalIndex, 'keluar');
        actionCell.appendChild(deleteButton);
    });
}

/**
 * Menghapus surat berdasarkan index dan jenisnya.
 */
function deleteSurat(index, type) {
    if (confirm(`Yakin ingin menghapus surat ${type} ini? Aksi ini tidak bisa dibatalkan.`)) {
        if (type === 'masuk') {
            suratMasuk.splice(index, 1);
        } else if (type === 'keluar') {
            suratKeluar.splice(index, 1);
        }
        updateDataAndUI();
        alert('Surat berhasil dihapus!');
    }
}

/**
 * Memfilter surat berdasarkan input pencarian.
 */
function filterSurat() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    // Filter Surat Masuk
    const filteredMasuk = suratMasuk.filter(surat => {
        return (
            surat.noSurat.toLowerCase().includes(searchTerm) ||
            surat.asal.toLowerCase().includes(searchTerm) ||
            surat.perihal.toLowerCase().includes(searchTerm)
        );
    });

    // Filter Surat Keluar
    const filteredKeluar = suratKeluar.filter(surat => {
        return (
            surat.noSurat.toLowerCase().includes(searchTerm) ||
            surat.tujuan.toLowerCase().includes(searchTerm) ||
            surat.perihal.toLowerCase().includes(searchTerm)
        );
    });

    // Render tabel dengan data yang sudah difilter
    renderSuratTables(filteredMasuk, filteredKeluar);
}

/**
 * Memperbarui angka statistik di halaman Beranda dan badge.
 */
function updateStats() {
    const countMasukEl = document.getElementById('count-masuk');
    const countKeluarEl = document.getElementById('count-keluar');
    const badgeMasukEl = document.getElementById('badge-masuk');
    const badgeKeluarEl = document.getElementById('badge-keluar');
    
    if (countMasukEl) countMasukEl.textContent = suratMasuk.length;
    if (countKeluarEl) countKeluarEl.textContent = suratKeluar.length;
    if (badgeMasukEl) badgeMasukEl.textContent = suratMasuk.length;
    if (badgeKeluarEl) badgeKeluarEl.textContent = suratKeluar.length;
}

// --- Bagian II: Logic Navigasi & Form Submit ---

// Navigasi Sidebar
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const targetId = e.target.closest('button').dataset.target;

        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
        e.target.closest('button').classList.add('active-nav');

        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active-section');
        });

        document.getElementById(targetId).classList.add('active-section');

        // Reset input cari saat pindah halaman
        if (document.getElementById('search-input')) {
            document.getElementById('search-input').value = '';
        }
        
        updateDataAndUI();
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
    updateDataAndUI(); 

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
    updateDataAndUI(); 

    alert('Surat Keluar Berhasil Disimpan!');
    e.target.reset(); 
});


// --- Bagian III: Inisialisasi Aplikasi ---

document.addEventListener('DOMContentLoaded', () => {
    updateDataAndUI(); 
});