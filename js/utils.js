// Utility functions

// Format waktu (detik ke menit:detik)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Generate random ID
function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Save score to localStorage
function saveScore(name, score, packId) {
    try {
        const scores = JSON.parse(localStorage.getItem('wuizzizzz_scores') || '[]');
        const newScore = {
            id: generateId(),
            name: name,
            score: score,
            packId: packId,
            date: new Date().toISOString(),
            rank: calculateRank(score)
        };
        
        scores.push(newScore);
        
        // Keep only top 10 scores
        const topScores = scores
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        
        localStorage.setItem('wuizzizzz_scores', JSON.stringify(topScores));
        return newScore;
    } catch (error) {
        console.error('Error saving score:', error);
        return null;
    }
}

// Calculate rank based on score
function calculateRank(score) {
    if (score >= 18) return "CENDEKIAWAN UNGGUL";
    if (score >= 15) return "STRATEGIS MUDA";
    if (score >= 10) return "PEJUANG TANGGUH";
    if (score >= 5) return "PEMULA BERBAKAT";
    return "PEJUANG";
}

// Get high scores
function getHighScores() {
    try {
        return JSON.parse(localStorage.getItem('wuizzizzz_scores') || '[]');
    } catch (error) {
        console.error('Error getting scores:', error);
        return [];
    }
}

// Vibrate device (if supported)
function vibrate(duration = 50) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

// Check if device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Prevent zoom on input focus (for mobile)
function preventZoomOnFocus() {
    if (isMobileDevice()) {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                document.body.style.zoom = "100%";
            });
        });
    }
}

// Initialize utility functions
document.addEventListener('DOMContentLoaded', function() {
    preventZoomOnFocus();
    
    // Add touch feedback for mobile
    if (isMobileDevice()) {
        document.addEventListener('touchstart', function() {}, {passive: true});
    }
});

// Export utility functions
window.utils = {
    formatTime,
    generateId,
    shuffleArray,
    saveScore,
    getHighScores,
    calculateRank,
    vibrate,
    isMobileDevice
};
