// State aplikasi
let curIdx = 0;
let score = 0;
let timeLeft = 60;
let timerId = null;
let state = "CHOOSING";
let userName = "PESERTA";
let wrongQuestions = [];
let isRedemptionMode = false;
let selectedOption = null;

// Inisialisasi aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi pilihan paket soal
    if (window.questionManager) {
        window.questionManager.initPackSelector();
    }
    
    // Setup tutorial dropdown
    const tutorialToggle = document.getElementById('tutorial-toggle');
    const tutorialContent = document.getElementById('tutorial-content');
    const tutorialChevron = document.getElementById('tutorial-chevron');
    
    if (tutorialToggle) {
        tutorialToggle.addEventListener('click', function() {
            const isVisible = tutorialContent.classList.contains('show');
            if (isVisible) {
                tutorialContent.classList.remove('show');
                tutorialChevron.classList.remove('rotate-180');
                setTimeout(() => tutorialContent.classList.add('hidden'), 300);
            } else {
                tutorialContent.classList.remove('hidden');
                setTimeout(() => {
                    tutorialContent.classList.add('show');
                    tutorialChevron.classList.add('rotate-180');
                }, 10);
            }
        });
    }
    
    // Enter untuk login
    const userNameInput = document.getElementById('user-name');
    if (userNameInput) {
        userNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                attemptLogin();
            }
        });
    }
});

// Login attempt
function attemptLogin() {
    const val = document.getElementById('user-name').value;
    if (val.trim().length > 1) {
        userName = val.toUpperCase();
        
        // Show loading
        showLoading(true);
        
        // Load questions for selected pack
        const packId = window.questionManager?.currentPackId || 1;
        
        window.questionManager.loadQuestions(packId).then(() => {
            // Update UI
            document.getElementById('display-name').innerText = userName;
            document.getElementById('rank-name').innerText = userName;
            
            // Hide login, show quiz
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('quiz-screen').classList.remove('hidden');
            
            // Reset state
            curIdx = 0;
            score = 0;
            wrongQuestions = [];
            isRedemptionMode = false;
            
            // Update score display
            document.getElementById('streak-text').innerText = `SKOR: ${score}`;
            
            // Load first question
            loadQuestion();
            
            showLoading(false);
        }).catch(error => {
            console.error('Error loading questions:', error);
            alert('Gagal memuat soal. Silakan coba lagi.');
            showLoading(false);
        });
        
    } else {
        alert("Namamu mana? ZAM ZAM butuh namamu untuk di papan peringkat!");
    }
}

// Memuat soal
function loadQuestion() {
    state = "CHOOSING";
    timeLeft = 60;
    selectedOption = null;
    
    const totalQuestions = window.questionManager.getTotalQuestions();
    const q = isRedemptionMode ? wrongQuestions[0] : window.questionManager.getQuestion(curIdx);
    
    // Update progress bar
    const progressPercent = ((curIdx) / totalQuestions) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
    
    // Update question display
    document.getElementById('q-category').innerText = q?.cat || "UMUM";
    document.getElementById('q-text').innerText = q?.q || "Memuat tantangan...";
    document.getElementById('feedback-area').classList.remove('show');
    document.getElementById('feedback-area').classList.add('hidden');
    
    // Update action button
    const btn = document.getElementById('main-action-btn');
    btn.disabled = true;
    btn.className = "w-full py-3 md:py-4 duo-btn btn-gray rounded-2xl font-black text-base md:text-lg uppercase transition-all";
    btn.innerText = isRedemptionMode ? "TEBUS DOSA" : "Pilih Jawaban";
    
    // Clear and populate options
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    if (q && q.o) {
        let displayOptions = q.o;
        
        // In redemption mode, show only 3 options
        if (isRedemptionMode && displayOptions.length > 3) {
            // Keep the correct answer and 2 random wrong answers
            const correctIndex = q.a;
            const wrongOptions = displayOptions.filter((_, idx) => idx !== correctIndex);
            const randomWrongs = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
            displayOptions = [displayOptions[correctIndex], ...randomWrongs].sort(() => 0.5 - Math.random());
            
            // Update correct answer index for new array
            q.a = displayOptions.indexOf(q.o[correctIndex]);
        }
        
        displayOptions.forEach((opt, idx) => {
            const div = document.createElement('div');
            div.className = "option-item p-3 md:p-4 rounded-2xl font-bold text-sm md:text-base cursor-pointer bg-white";
            div.innerText = opt;
            div.onclick = () => selectOption(idx, div);
            container.appendChild(div);
        });
    }
    
    startTimer();
}

// Memulai timer
function startTimer() {
    if (timerId) clearInterval(timerId);
    const display = document.getElementById('timer-display');
    display.classList.remove('timer-critical');
    display.innerText = timeLeft;
    
    timerId = setInterval(() => {
        timeLeft--;
        display.innerText = timeLeft;
        
        if (timeLeft <= 10) {
            display.classList.add('timer-critical');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            handleReveal(true); // Timeout
        }
    }, 1000);
}

// Memilih opsi jawaban
function selectOption(idx, el) {
    if (state !== "CHOOSING") return;
    
    // Remove selection from all options
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to clicked option
    el.classList.add('selected');
    selectedOption = idx;
    
    // Enable action button
    const btn = document.getElementById('main-action-btn');
    btn.disabled = false;
    btn.className = "w-full py-3 md:py-4 duo-btn btn-blue rounded-2xl font-black text-base md:text-lg uppercase transition-all";
    btn.innerText = isRedemptionMode ? "Periksa Tebusan" : "Periksa Jawaban";
}

// Menangani aksi tombol
function handleAction() {
    if (state === "CHOOSING") {
        handleReveal();
    } else {
        if (isRedemptionMode) {
            // Remove the redeemed question
            wrongQuestions.shift();
            
            // If no more wrong questions, show final result
            if (wrongQuestions.length === 0) {
                showFinalResult();
                return;
            }
            
            // Load next redemption question
            loadQuestion();
        } else {
            curIdx++;
            if (curIdx < window.questionManager.getTotalQuestions()) {
                loadQuestion();
            } else {
                showFinalResult();
            }
        }
    }
}

// Menampilkan jawaban yang benar/salah
function handleReveal(isTimeout = false) {
    clearInterval(timerId);
    state = "FEEDBACK";
    
    const totalQuestions = window.questionManager.getTotalQuestions();
    const q = isRedemptionMode ? wrongQuestions[0] : window.questionManager.getQuestion(curIdx);
    const selected = isTimeout ? null : selectedOption;
    const items = document.querySelectorAll('.option-item');
    const btn = document.getElementById('main-action-btn');
    const feedback = document.getElementById('feedback-area');
    
    const isCorrect = selected === q.a;
    
    if (isCorrect) {
        // Correct answer
        score += (isRedemptionMode ? 1 : 2);
        document.getElementById('streak-text').innerText = `SKOR: ${score}`;
        
        if (selected !== null) {
            items[selected].classList.add('correct');
        }
        
        // Show feedback
        feedback.classList.remove('hidden');
        setTimeout(() => feedback.classList.add('show'), 10);
        
        feedback.querySelector('#feedback-icon').className = 
            "w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg md:text-xl shadow-md";
        feedback.querySelector('#feedback-icon').innerText = "✔";
        
        document.getElementById('feedback-title').innerText = 
            isRedemptionMode ? "DOSA DITEBUS! 🎉" : "TEPAT SEKALI! 🦉";
        document.getElementById('feedback-title').className = "font-black text-sm md:text-base text-green-600";
        
        document.getElementById('feedback-sub').innerText = 
            isRedemptionMode ? "Poin +1 untuk penebusan dosa!" : `Poin +2 untuk ${userName}!`;
        
        btn.className = "w-full py-3 md:py-4 duo-btn btn-green rounded-2xl font-black text-base md:text-lg uppercase transition-all";
        btn.innerText = isRedemptionMode ? "Lanjutkan Tebusan" : "Lanjut ke Soal Berikutnya";
        
        // Confetti effect
        confetti({ 
            particleCount: isRedemptionMode ? 60 : 100, 
            spread: 70, 
            origin: { y: 0.9 },
            colors: isRedemptionMode ? ['#a855f7', '#7e22ce'] : ['#58cc02', '#46a302']
        });
        
        // Auto continue after delay
        setTimeout(() => {
            if (state === "FEEDBACK") {
                handleAction();
            }
        }, 1500);
        
    } else {
        // Wrong answer or timeout
        if (!isRedemptionMode && !isTimeout) {
            wrongQuestions.push(q);
        }
        
        // Highlight wrong and correct answers
        if (selected !== null && !isTimeout) {
            items[selected].classList.add('wrong');
        }
        
        if (items[q.a]) {
            items[q.a].classList.add('correct');
        }
        
        // Show feedback
        feedback.classList.remove('hidden');
        setTimeout(() => feedback.classList.add('show'), 10);
        
        feedback.querySelector('#feedback-icon').className = 
            "w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg md:text-xl shadow-md";
        feedback.querySelector('#feedback-icon').innerText = isTimeout ? "⏰" : "✖";
        
        document.getElementById('feedback-title').innerText = 
            isTimeout ? "WAKTU HABIS! ⏰" : "KURANG TEPAT";
        document.getElementById('feedback-title').className = "font-black text-sm md:text-base text-red-600";
        
        document.getElementById('feedback-sub').innerText = 
            isTimeout ? "Cepat dan tepat di soal berikutnya!" : `Jawaban benar: ${q.o[q.a]}`;
        
        btn.className = "w-full py-3 md:py-4 duo-btn btn-red rounded-2xl font-black text-base md:text-lg uppercase transition-all";
        btn.innerText = isRedemptionMode ? "Pelajari & Lanjut" : "Lanjut ke Soal Berikutnya";
    }
}

// Menampilkan hasil akhir
function showFinalResult() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    
    // Update score and rank
    document.getElementById('final-score').innerText = score;
    
    const quotes = window.questionManager?.resultQuotes || ["Kamu hebat!"];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('result-quote').innerText = `"${randomQuote}"`;
    
    // Determine rank
    const totalQuestions = window.questionManager.getTotalQuestions();
    const maxScore = totalQuestions * 2;
    const percentage = (score / maxScore) * 100;
    
    let rank = "PEJUANG";
    if (percentage >= 90) rank = "SMAGA GENIUS 🥇";
    else if (percentage >= 70) rank = "STRATEGIS MUDA 🥈";
    else if (percentage >= 50) rank = "PEJUANG TANGGUH 🥉";
    else if (percentage >= 30) rank = "PEMULA BERBAKAT";
    
    document.getElementById('final-rank').innerText = `LEVEL: ${rank}`;
    
    // Show/hide redemption box
    const redemptionBox = document.getElementById('redemption-box');
    const wrongCount = document.getElementById('wrong-count');
    
    if (wrongQuestions.length > 0 && !isRedemptionMode) {
        redemptionBox.classList.remove('hidden');
        wrongCount.textContent = wrongQuestions.length;
    } else {
        redemptionBox.classList.add('hidden');
    }
    
    // Confetti celebration
    confetti({ 
        particleCount: 200, 
        spread: 100, 
        origin: { y: 0.5 },
        colors: ['#1cb0f6', '#58cc02', '#a855f7', '#ff4b4b']
    });
}

// Memulai mode tebus dosa
function startRedemption() {
    isRedemptionMode = true;
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    
    // Reset index for redemption mode
    curIdx = 0;
    loadQuestion();
}

// Mengulang dengan paket yang sama
function restartSamePack() {
    location.reload();
}

// Menampilkan/menyembunyikan loading
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }
}

// Ekspor fungsi ke window object
window.attemptLogin = attemptLogin;
window.handleAction = handleAction;
window.startRedemption = startRedemption;
window.restartSamePack = restartSamePack;
window.selectOption = selectOption;

