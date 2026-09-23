/* ==========================================================================
   HAPPY BIRTHDAY DIII - INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. PASSCODE GATE SCREEN VALIDATION (Passcode: 24092007) ---
    const passcodeScreen = document.getElementById('passcode-screen');
    const passcodeInput = document.getElementById('passcode-input');
    const btnUnlockPasscode = document.getElementById('btn-unlock-passcode');
    const passcodeError = document.getElementById('passcode-error');
    const openingScreen = document.getElementById('opening-screen');

    const SECRET_PASSCODE = '24092007';

    function checkPasscode() {
        const val = passcodeInput.value.trim();
        if (val === SECRET_PASSCODE) {
            passcodeError.classList.add('hidden');
            
            // Confetti burst on correct passcode unlock!
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 60,
                    spread: 60,
                    origin: { y: 0.5 },
                    colors: ['#3b82f6', '#93c5fd', '#ffffff']
                });
            }

            // Smooth transition from passcode screen to opening screen
            passcodeScreen.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            passcodeScreen.style.opacity = '0';
            passcodeScreen.style.transform = 'scale(0.95)';

            setTimeout(() => {
                passcodeScreen.classList.add('hidden-screen');
                openingScreen.classList.remove('hidden-screen');
                openingScreen.style.opacity = '1';
                openingScreen.style.transform = 'scale(1)';
            }, 500);
        } else {
            passcodeError.classList.remove('hidden');
            passcodeInput.style.borderColor = '#ef4444';
            passcodeInput.focus();
        }
    }

    btnUnlockPasscode.addEventListener('click', checkPasscode);

    passcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPasscode();
        }
    });

    passcodeInput.addEventListener('input', () => {
        passcodeError.classList.add('hidden');
        passcodeInput.style.borderColor = 'var(--light-blue)';
    });

    // --- 1. PARTICLE CANVAS ENGINE (Floating Hearts, Stars, Glowing Particles) ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 45);

    // Strictly cute, romantic & emotional symbols (NO laughing symbols)
    const symbols = ['💙', '✨', '⭐', '🎂', '🤍', '🫶🏻', '🌸'];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 16 + 10;
            this.speedY = Math.random() * 1.2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
            this.opacity = Math.random() * 0.7 + 0.3;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 1.5;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;
            this.rotation += this.rotSpeed;

            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.symbol, 0, 0);
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --- 2. WEB AUDIO SYNTHESIZER FOR ROMANTIC LOVE MUSIC ---
    let audioCtx = null;
    let isPlaying = false;
    let musicInterval = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Soothing Romantic Love Melody (Fmaj7 -> Dm7 -> Bbmaj7 -> C7 arpeggios)
    const loveMelody = [
        // Fmaj7
        { freq: 349.23, duration: 0.6 }, // F4
        { freq: 440.00, duration: 0.6 }, // A4
        { freq: 523.25, duration: 0.6 }, // C5
        { freq: 659.25, duration: 0.8 }, // E5
        // Dm7
        { freq: 293.66, duration: 0.6 }, // D4
        { freq: 349.23, duration: 0.6 }, // F4
        { freq: 440.00, duration: 0.6 }, // A4
        { freq: 523.25, duration: 0.8 }, // C5
        // Bbmaj7
        { freq: 233.08, duration: 0.6 }, // Bb3
        { freq: 293.66, duration: 0.6 }, // D4
        { freq: 349.23, duration: 0.6 }, // F4
        { freq: 440.00, duration: 0.8 }, // A4
        // C7
        { freq: 261.63, duration: 0.6 }, // C4
        { freq: 329.63, duration: 0.6 }, // E4
        { freq: 392.00, duration: 0.6 }, // G4
        { freq: 466.16, duration: 0.8 }  // Bb4
    ];
    let noteIndex = 0;

    function playNextNote() {
        if (!isPlaying || !audioCtx) return;

        try {
            const noteObj = loveMelody[noteIndex % loveMelody.length];
            
            // Soft sine wave for melody
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(noteObj.freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + noteObj.duration + 0.4);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + noteObj.duration + 0.4);

            // Subtle warm companion chord layer
            if (noteIndex % 4 === 0) {
                const bassOsc = audioCtx.createOscillator();
                const bassGain = audioCtx.createGain();
                bassOsc.type = 'triangle';
                bassOsc.frequency.setValueAtTime(noteObj.freq / 2, audioCtx.currentTime);
                bassGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                bassGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);
                bassOsc.connect(bassGain);
                bassGain.connect(audioCtx.destination);
                bassOsc.start();
                bassOsc.stop(audioCtx.currentTime + 2.0);
            }

            noteIndex++;
        } catch (e) {
            console.log("Audio play error", e);
        }
    }

    const musicBtn = document.getElementById('music-control-btn');
    const musicText = document.getElementById('music-text');

    function toggleMusic() {
        initAudio();
        isPlaying = !isPlaying;

        if (isPlaying) {
            musicBtn.classList.add('playing');
            musicText.textContent = 'Pause Music ⏸️';
            musicInterval = setInterval(playNextNote, 650);
            playNextNote();
        } else {
            musicBtn.classList.remove('playing');
            musicText.textContent = 'Play Romantic Music 💙';
            if (musicInterval) clearInterval(musicInterval);
        }
    }

    musicBtn.addEventListener('click', toggleMusic);

    // Cute celebration chime when cake is clicked
    function playCelebrationChime() {
        initAudio();
        if (!audioCtx) return;

        const chimeNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        chimeNotes.forEach((freq, idx) => {
            setTimeout(() => {
                try {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 1.0);
                } catch (e) {}
            }, idx * 120);
        });
    }

    // --- 3. OPEN SURPRISE BUTTON & NAVIGATION ---
    const btnOpenSurprise = document.getElementById('btn-open-surprise');
    const mainContent = document.getElementById('main-content');

    btnOpenSurprise.addEventListener('click', () => {
        // Start romantic music on user interaction
        if (!isPlaying) {
            toggleMusic();
        }

        // Celebratory initial confetti explosion
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#93c5fd', '#3b82f6', '#ffffff', '#bfdbfe']
            });
        }

        // Fade transition
        openingScreen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        openingScreen.style.opacity = '0';
        openingScreen.style.transform = 'scale(0.95)';

        setTimeout(() => {
            openingScreen.style.display = 'none';
            mainContent.classList.remove('hidden-content');
            mainContent.classList.add('show');

            const specialSection = document.getElementById('special-birthday');
            specialSection.scrollIntoView({ behavior: 'smooth' });
        }, 600);
    });

    // --- 4. INTERACTIVE BIRTHDAY CAKE SURPRISE ---
    const cakeTrigger = document.getElementById('cake-click-trigger');
    const flames = document.querySelectorAll('.flame');
    const tapHint = document.getElementById('tap-hint');
    const revealMessage = document.getElementById('reveal-message');
    let cakeTapped = false;

    cakeTrigger.addEventListener('click', () => {
        if (cakeTapped) return;
        cakeTapped = true;

        // Play celebration chime
        playCelebrationChime();

        // Extinguish candles animation
        flames.forEach(flame => {
            flame.classList.add('extinguished');
        });

        // Hide tap hint badge
        tapHint.style.display = 'none';

        // Multi-stage confetti burst!
        if (typeof confetti === 'function') {
            const count = 220;
            const defaults = { origin: { y: 0.7 } };

            function fire(particleRatio, opts) {
                confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                }));
            }

            fire(0.25, {
                spread: 28,
                startVelocity: 55,
                colors: ['#3b82f6', '#93c5fd', '#ffffff']
            });
            fire(0.2, {
                spread: 65,
                colors: ['#60a5fa', '#bfdbfe']
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                colors: ['#ffffff', '#60a5fa']
            });
        }

        // Unveil reveal message
        revealMessage.classList.remove('hidden');
        revealMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // --- 5. LIGHTBOX MODAL FOR PHOTO GALLERY ---
    const galleryItems = document.querySelectorAll('.polaroid-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.polaroid-caption span');

            if (img) {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = caption ? caption.textContent : 'Precious Memory 💙';
                lightbox.classList.add('active');
            }
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // --- 6. REPLAY SURPRISE BUTTON ---
    const btnReplay = document.getElementById('btn-replay');

    btnReplay.addEventListener('click', () => {
        // Reset cake state
        cakeTapped = false;
        flames.forEach(flame => flame.classList.remove('extinguished'));
        tapHint.style.display = 'inline-block';
        revealMessage.classList.add('hidden');

        // Transition back to opening screen
        openingScreen.style.display = 'flex';
        openingScreen.style.opacity = '1';
        openingScreen.style.transform = 'scale(1)';

        mainContent.classList.remove('show');
        mainContent.classList.add('hidden-content');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
