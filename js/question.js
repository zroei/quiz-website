// Database soal default (fallback jika file JSON tidak ada)
const defaultQuestions = [
    { cat: "IPA", q: "Bagian darah yang berfungsi untuk pembekuan darah adalah...", o: ["Plasma Darah", "Trombosit", "Leukosit", "Eritrosit"], a: 1 },
    { cat: "WAWASAN", q: "Lagu daerah 'Lir Ilir' merupakan warisan budaya dari...", o: ["Jawa Timur", "Jawa Tengah", "Jawa Barat", "Madura"], a: 1 },
    { cat: "IPS", q: "Garis lintang 0 derajat disebut juga sebagai garis...", o: ["Bujur", "Khatulistiwa", "Meridian", "Lintang Utara"], a: 1 },
    { cat: "SDGs", q: "Berapa total target utama (Goals) dalam agenda SDGs 2030?", o: ["15", "16", "17", "18"], a: 2 },
    { cat: "BUDAYA", q: "Senjata tradisional Rencong berasal dari daerah...", o: ["Aceh", "Riau", "Palembang", "Lampung"], a: 0 },
    { cat: "EKRAF", q: "Aplikasi e-commerce termasuk dalam subsektor ekonomi kreatif...", o: ["Kuliner", "Aplikasi", "Kriya", "Desain"], a: 1 },
    { cat: "IPA", q: "Bunyi yang frekuensinya di atas 20.000 Hz disebut...", o: ["Infrasonik", "Audiosonik", "Ultrasonik", "Supersonik"], a: 2 },
    { cat: "WAWASAN", q: "Siapakah pencipta lambang negara Burung Garuda?", o: ["Moh. Hatta", "Sultan Hamid II", "Mr. Soepomo", "Raden Saleh"], a: 1 },
    { cat: "IPS", q: "Benua yang dijuluki sebagai Benua Hitam adalah...", o: ["Europa", "Amerika", "Afrika", "Australia"], a: 2 },
    { cat: "IPA", q: "Alat untuk mengukur tekanan udara adalah...", o: ["Termometer", "Barometer", "Higrometer", "Anemometer"], a: 1 }
];

// Database paket soal yang tersedia
const questionPacks = [
    { id: 1, name: "Paket Basic", description: "Soal dasar untuk pemula", count: 10, color: "from-green-500 to-emerald-600" },
    { id: 2, name: "Paket Medium", description: "Tingkat kesulitan menengah", count: 15, color: "from-blue-500 to-indigo-600" },
    { id: 3, name: "Paket Advanced", description: "Tantangan untuk expert", count: 20, color: "from-purple-500 to-pink-600" }
];

let currentPackId = 1;
let currentQuestions = [];

// Memuat soal dari file JSON
async function loadQuestions(packId) {
    try {
        showLoading(true);
        const response = await fetch(`questions/${packId}.json`);
        
        if (!response.ok) {
            throw new Error(`File questions/${packId}.json tidak ditemukan`);
        }
        
        const data = await response.json();
        currentQuestions = data.questions;
        
        // Update UI dengan nama paket
        document.getElementById('current-pack-name').textContent = 
            questionPacks.find(pack => pack.id === packId)?.name || `Paket ${packId}`;
        
        return currentQuestions;
    } catch (error) {
        console.warn(`Gagal memuat soal paket ${packId}:`, error.message);
        console.log('Menggunakan soal default...');
        
        // Gunakan soal default dengan sedikit modifikasi berdasarkan paket
        currentQuestions = JSON.parse(JSON.stringify(defaultQuestions));
        
        // Untuk paket 2 dan 3, tambahkan lebih banyak soal
        if (packId === 2) {
            const extraQuestions = [
                { cat: "MATEMATIKA", q: "Hasil dari 7² + 8² adalah...", o: ["49", "64", "113", "128"], a: 2 },
                { cat: "SEJARAH", q: "Proklamasi Kemerdekaan Indonesia dibacakan pada tanggal...", o: ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "19 Agustus 1945"], a: 1 },
                { cat: "BAHASA", q: "Sinonim dari kata 'gembira' adalah...", o: ["Sedih", "Senang", "Marah", "Takut"], a: 1 },
                { cat: "GEOGRAFI", q: "Gunung tertinggi di Indonesia adalah...", o: ["Semeru", "Kerinci", "Rinjani", "Jaya Wijaya"], a: 3 },
                { cat: "OLAHRAGA", q: "Jumlah pemain sepak bola dalam satu tim adalah...", o: ["9", "10", "11", "12"], a: 2 }
            ];
            currentQuestions = [...currentQuestions, ...extraQuestions];
        } else if (packId === 3) {
            const extraQuestions = [
                { cat: "FISIKA", q: "Hukum kekekalan energi ditemukan oleh...", o: ["Newton", "Einstein", "Joule", "Faraday"], a: 2 },
                { cat: "KIMIA", q: "Unsur dengan simbol Au adalah...", o: ["Perak", "Emas", "Aluminium", "Tembaga"], a: 1 },
                { cat: "BIOLOGI", q: "Organel sel yang berfungsi sebagai tempat respirasi adalah...", o: ["Nukleus", "Mitokondria", "Ribosom", "Lisosom"], a: 1 },
                { cat: "EKONOMI", q: "Indeks harga yang mengukur inflasi di Indonesia adalah...", o: ["IHK", "IPI", "IKD", "ILO"], a: 0 },
                { cat: "TEKNOLOGI", q: "Bahasa pemrograman untuk pengembangan web frontend adalah...", o: ["Python", "Java", "JavaScript", "C++"], a: 2 },
                { cat: "SENI", q: "Pelukis terkenal 'Affandi' berasal dari negara...", o: ["Malaysia", "Indonesia", "Singapura", "Thailand"], a: 1 },
                { cat: "AGAMA", q: "Kitab suci umat Hindu adalah...", o: ["Tripitaka", "Wedha", "Al-Quran", "Injil"], a: 1 },
                { cat: "SOSIOLOGI", q: "Proses belajar kebudayaan sendiri disebut...", o: ["Akulturasi", "Enkulturasi", "Asimilasi", "Difusi"], a: 1 },
                { cat: "POLITIK", q: "Lembaga negara yang berwenang mengubah UUD adalah...", o: ["Presiden", "MA", "MK", "MPR"], a: 3 },
                { cat: "LINGKUNGAN", q: "Gas rumah kaca utama penyebab pemanasan global adalah...", o: ["Oksigen", "Nitrogen", "Karbon dioksida", "Hidrogen"], a: 2 }
            ];
            currentQuestions = [...currentQuestions, ...extraQuestions];
        }
        
        return currentQuestions;
    } finally {
        showLoading(false);
    }
}

// Menginisialisasi pilihan paket soal
function initPackSelector() {
    const container = document.getElementById('question-pack-selector');
    container.innerHTML = '';
    
    questionPacks.forEach(pack => {
        const button = document.createElement('button');
        button.className = `pack-option ${pack.id === currentPackId ? 'selected' : ''}`;
        button.innerHTML = `
            <div class="font-black">${pack.id}</div>
            <div class="text-[8px] opacity-75">${pack.name.split(' ')[1] || 'Paket'}</div>
        `;
        button.onclick = () => selectPack(pack.id);
        container.appendChild(button);
    });
}

// Memilih paket soal
function selectPack(packId) {
    currentPackId = packId;
    
    // Update UI selection
    document.querySelectorAll('.pack-option').forEach((btn, index) => {
        if (questionPacks[index].id === packId) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    // Load preview atau info paket
    const pack = questionPacks.find(p => p.id === packId);
    if (pack) {
        console.log(`Paket ${pack.name} dipilih (${pack.count} soal)`);
    }
}

// Mendapatkan soal berdasarkan indeks
function getQuestion(index) {
    return currentQuestions[index];
}

// Mendapatkan total soal
function getTotalQuestions() {
    return currentQuestions.length;
}

// Mendapatkan paket soal yang sedang aktif
function getCurrentPack() {
    return questionPacks.find(pack => pack.id === currentPackId);
}

// Quotes untuk hasil
const resultQuotes = [
    "Juara sejati tidak pernah berhenti mencoba.",
    "Usaha tidak akan mengkhianati hasil, SMAGA Jaya!",
    "Fokus pada proses, hasil akan mengikuti dengan bangga.",
    "Kamu lebih kuat dari yang kamu bayangkan hari ini.",
    "Setiap kesalahan adalah pelajaran menuju kesempurnaan.",
    "Pemenang adalah mereka yang bangkit setelah jatuh.",
    "Skill + Attitude = Sukses! Terus berlatih!",
    "Masa depan dimulai dari langkah kecil hari ini."
];

// Ekspor fungsi dan variabel yang diperlukan
window.questionManager = {
    loadQuestions,
    getQuestion,
    getTotalQuestions,
    getCurrentPack,
    resultQuotes,
    initPackSelector,
    selectPack,
    currentPackId
};
