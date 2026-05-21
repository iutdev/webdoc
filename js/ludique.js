/* ============================================================
   LUDIQUE.JS — Messages codés, Générateur d'affiches, Quiz
   ============================================================ */

/* ─────────────────────────────────────────────
   1. MESSAGES CODÉS
───────────────────────────────────────────── */

// ── CÉSAR ──────────────────────────────────
// Message original : "LA MUSIQUE EST UNE ARME"
// Encodé avec clé=3 → "OD PXVLTXH HVW XQH DUPH"
// Le slider tente de décoder : à clé=3 → message original révélé
(function () {
  const ENCRYPTED = 'OD PXVLTXH HVW XQH DUPH';
  const ORIGINAL  = 'LA MUSIQUE EST UNE ARME';
  const KEY       = 3;

  const liveEl   = document.getElementById('cesar-live');
  const result   = document.getElementById('cesar-result');
  const slider   = document.getElementById('cesar-slider');
  const shiftLbl = document.getElementById('cesar-shift-display');
  const hint     = document.getElementById('cesar-hint');

  if (!slider) return;

  function caesarDecode(text, shift) {
    return text.split('').map(c => {
      if (c >= 'A' && c <= 'Z') {
        return String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
      }
      return c;
    }).join('');
  }

  slider.addEventListener('input', () => {
    const shift = parseInt(slider.value);
    shiftLbl.textContent = shift;
    const attempt = caesarDecode(ENCRYPTED, shift);
    liveEl.textContent = attempt;

    if (shift === KEY) {
      liveEl.classList.add('decoded-ok');
      result.classList.remove('hidden');
      hint.textContent = '✦ Bravo — clé 3 trouvée !';
      hint.style.color = 'var(--accent-warm)';
    } else {
      liveEl.classList.remove('decoded-ok');
      result.classList.add('hidden');
      hint.textContent = 'Le message se révèle quand tu trouves la bonne clé…';
      hint.style.color = '';
    }
  });

  // Affichage initial : texte chiffré, slider à 1
  liveEl.textContent = ENCRYPTED;
})();


// ── MORSE ──────────────────────────────────
// Message : "BELLA CIAO"
// Morse   : -... . .-.. .-.. .- / -.-. .. .- ---
// L'audio joue EXACTEMENT cette séquence.

const MORSE_SEQUENCE = [
  // B
  { type: 'dash' }, { type: 'dot' }, { type: 'dot' }, { type: 'dot' },
  { type: 'letter-gap' },
  // E
  { type: 'dot' },
  { type: 'letter-gap' },
  // L
  { type: 'dot' }, { type: 'dash' }, { type: 'dot' }, { type: 'dot' },
  { type: 'letter-gap' },
  // L
  { type: 'dot' }, { type: 'dash' }, { type: 'dot' }, { type: 'dot' },
  { type: 'letter-gap' },
  // A
  { type: 'dot' }, { type: 'dash' },
  { type: 'word-gap' },
  // C
  { type: 'dash' }, { type: 'dot' }, { type: 'dash' }, { type: 'dot' },
  { type: 'letter-gap' },
  // I
  { type: 'dot' }, { type: 'dot' },
  { type: 'letter-gap' },
  // A
  { type: 'dot' }, { type: 'dash' },
  { type: 'letter-gap' },
  // O
  { type: 'dash' }, { type: 'dash' }, { type: 'dash' }
];

let morsePlaying = false;

function playMorse() {
  if (morsePlaying) return;
  morsePlaying = true;

  const btn = document.getElementById('morse-play-btn');
  btn.disabled = true;
  btn.querySelector('.morse-icon').textContent = '🔊';

  const ctx  = new (window.AudioContext || window.webkitAudioContext)();
  const unit = 0.09; // secondes par unité de temps morse
  let t = ctx.currentTime + 0.15;

  function beep(duration) {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 680;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.45, t + 0.008);
    gain.gain.setValueAtTime(0.45, t + duration - 0.008);
    gain.gain.linearRampToValueAtTime(0, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.01);
    t += duration;
  }

  // Highlight des groupes de lettres pendant la lecture
  const groups = document.querySelectorAll('.morse-letter-group');
  let letterIdx = 0;
  const letterTimings = []; // {t_start, groupIndex}

  MORSE_SEQUENCE.forEach(sym => {
    if (sym.type === 'dot') {
      letterTimings.push({ t_start: t, groupIndex: letterIdx });
      beep(unit);
      t += unit * 0.6; // gap intra-lettre
    } else if (sym.type === 'dash') {
      letterTimings.push({ t_start: t, groupIndex: letterIdx });
      beep(unit * 3);
      t += unit * 0.6;
    } else if (sym.type === 'letter-gap') {
      t += unit * 1.5;
      letterIdx++;
    } else if (sym.type === 'word-gap') {
      t += unit * 3.5;
      letterIdx++;
    }
  });

  // Scheduling des highlights
  const startTime = ctx.currentTime + 0.15;
  letterTimings.forEach(({ t_start, groupIndex }) => {
    const delay = (t_start - startTime) * 1000;
    setTimeout(() => {
      groups.forEach(g => g.classList.remove('morse-active'));
      if (groups[groupIndex]) groups[groupIndex].classList.add('morse-active');
    }, delay);
  });

  const totalMs = (t - ctx.currentTime) * 1000 + 300;
  setTimeout(() => {
    morsePlaying = false;
    btn.disabled = false;
    btn.querySelector('.morse-icon').textContent = '▶';
    groups.forEach(g => g.classList.remove('morse-active'));
  }, totalMs);
}

function revealMorse() {
  const result = document.getElementById('morse-result');
  const decoded = document.getElementById('morse-decoded-text');
  result.classList.remove('hidden');

  // Révélation lettre par lettre
  const word = 'BELLA CIAO';
  decoded.textContent = '';
  word.split('').forEach((ch, i) => {
    setTimeout(() => {
      decoded.textContent += ch;
    }, i * 120);
  });
}


// ── BINAIRE ──────────────────────────────────
// Message : "MARLEY"
// M=77=01001101 A=65=01000001 R=82=01010010
// L=76=01001100 E=69=01000101 Y=89=01011001
// Animation : octet par octet → valeur ASCII → lettre

let binaryDecoding = false;

function decodeBinary() {
  if (binaryDecoding) return;
  binaryDecoding = true;

  const btn     = document.getElementById('binary-btn');
  const stepEl  = document.getElementById('binary-step-display');
  const wordEl  = document.getElementById('binary-result-word');
  const result  = document.getElementById('binary-result');
  const bytes   = document.querySelectorAll('.byte-group');

  btn.disabled = true;
  wordEl.textContent = '';
  stepEl.textContent = '';

  const data = [
    { bits: '01010110', value: 86, letter: 'V' },
    { bits: '01001001', value: 73, letter: 'I' },
    { bits: '01000011', value: 67, letter: 'C' },
    { bits: '01010100', value: 84, letter: 'T' },
    { bits: '01001111', value: 79, letter: 'O' },
    { bits: '01010010', value: 82, letter: 'R' }
  ];

  let i = 0;
  function stepDecode() {
    if (i >= data.length) {
      stepEl.textContent = '';
      result.classList.remove('hidden');
      return;
    }
    bytes.forEach(b => b.classList.remove('byte-active', 'byte-done'));
    bytes[i].classList.add('byte-active');

    const { bits, value, letter } = data[i];
    // Phase 1 : afficher bits → valeur
    stepEl.innerHTML = `<span class="step-bits">${bits}</span> → <span class="step-val">${value}</span>`;
    setTimeout(() => {
      // Phase 2 : valeur → lettre
      stepEl.innerHTML = `<span class="step-bits">${bits}</span> → <span class="step-val">${value}</span> → <span class="step-letter">${letter}</span>`;
      setTimeout(() => {
        bytes[i].classList.remove('byte-active');
        bytes[i].classList.add('byte-done');
        wordEl.textContent += letter;
        i++;
        setTimeout(stepDecode, 300);
      }, 500);
    }, 600);
  }

  stepDecode();
}


// ── ATBASH ──────────────────────────────────
// Encodé   : "YLY NZIOVB"
// Décodé   : "BOB MARLEY"
// Atbash   : position_i → position_(25-i)
// Vérif : B(1)→Y(24), O(14)→L(11), B→Y, M(12)→N(13),
//         A(0)→Z(25), R(17)→I(8), L(11)→O(14), E(4)→V(21), Y(24)→B(1)
// Animation : chaque lettre se retourne vers son miroir

let atbashDecoding = false;

function decodeAtbash() {
  if (atbashDecoding) return;
  atbashDecoding = true;

  const btn    = document.getElementById('atbash-btn');
  const chars  = document.querySelectorAll('.atbash-char[data-plain]');
  const result = document.getElementById('atbash-result');

  btn.disabled = true;

  chars.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('flipping');
      setTimeout(() => {
        el.textContent = el.dataset.plain;
        el.classList.remove('flipping');
        el.classList.add('flipped');
        if (i === chars.length - 1) {
          setTimeout(() => result.classList.remove('hidden'), 400);
        }
      }, 250);
    }, i * 180);
  });
}


/* ─────────────────────────────────────────────
   2. GÉNÉRATEUR D'AFFICHES
───────────────────────────────────────────── */

const posterState = {
  bg: 1,
  color: 'none',
  slogan: 'LA MUSIQUE\nN\'EST PAS\nNEUTRE',
  subtitle: 'MUSIQUE & RÉVOLUTIONS',
  year: '2026',
  bgImages: {}
};

// Préchargement des images de fond
[1, 2, 3].forEach(n => {
  const img = new Image();
  img.src = `assets/img/poster-bg-${n}.png`;
  img.onload = () => {
    posterState.bgImages[n] = img;
    if (n === 1) drawPoster();
  };
});

function selectBg(n) {
  posterState.bg = n;
  document.querySelectorAll('.bg-preset').forEach(b => b.classList.remove('active'));
  document.querySelector(`.bg-preset[data-bg="${n}"]`).classList.add('active');
  drawPoster();
}

function selectColor(c) {
  posterState.color = c;
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.color-btn[data-color="${c}"]`).classList.add('active');
  drawPoster();
}

function setSlogan(text) {
  posterState.slogan = text;
  document.querySelectorAll('.slogan-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('custom-slogan').value = '';
  drawPoster();
}

function updateCustomSlogan(val) {
  if (val.trim()) {
    posterState.slogan = val.toUpperCase();
    document.querySelectorAll('.slogan-btn').forEach(b => b.classList.remove('active'));
    drawPoster();
  }
}

function updateSubtitle(val) {
  posterState.subtitle = val.toUpperCase();
  drawPoster();
}

function updateYear(val) {
  posterState.year = val;
  drawPoster();
}

const COLOR_OVERLAYS = {
  none:  null,
  red:   'rgba(138, 44, 24, 0.45)',
  blue:  'rgba(28, 58, 79, 0.50)',
  sepia: 'rgba(107, 76, 42, 0.40)',
  green: 'rgba(20, 60, 20, 0.50)'
};

const TEXT_COLORS = {
  none:  '#1a1410',
  red:   '#dfd5b2',
  blue:  '#dfd5b2',
  sepia: '#dfd5b2',
  green: '#dfd5b2'
};

const ACCENT_COLORS = {
  none:  '#8a2c18',
  red:   '#dfd5b2',
  blue:  '#b08418',
  sepia: '#b08418',
  green: '#b08418'
};

function drawPoster() {
  const canvas = document.getElementById('poster-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Fond papier
  ctx.fillStyle = '#dfd5b2';
  ctx.fillRect(0, 0, W, H);

  // Image de fond
  const img = posterState.bgImages[posterState.bg];
  if (img) {
    // Couvre le bas de l'affiche (70% de la hauteur)
    const imgH = H * 0.72;
    const imgY = H - imgH;
    const scale = Math.max(W / img.width, imgH / img.height);
    const sw = W / scale, sh = imgH / scale;
    const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, imgY, W, imgH);
  }

  // Filtre couleur
  const overlay = COLOR_OVERLAYS[posterState.color];
  if (overlay) {
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, W, H);
  }

  const tc = TEXT_COLORS[posterState.color];
  const ac = ACCENT_COLORS[posterState.color];

  // Bande supérieure — fond papier opaque pour lisibilité du texte
  const bandH = H * 0.44;
  ctx.fillStyle = posterState.color === 'none' ? 'rgba(223,213,178,0.92)' : (overlay ? overlay.replace('0.4', '0.75').replace('0.5', '0.75').replace('0.45', '0.75') : 'rgba(223,213,178,0.92)');
  ctx.fillRect(0, 0, W, bandH);

  // Slogan principal — taille fixe calée sur le slogan le plus long (≈78px)
  const FONT_SIZE = 75;
  ctx.fillStyle = tc;
  ctx.textAlign = 'left';
  ctx.font = `900 ${FONT_SIZE}px "Anton", "Oswald", sans-serif`;

  const lines  = posterState.slogan.split('\n');
  const lineH  = FONT_SIZE * 1.08;
  let ty = 110; // ancre fixe depuis le haut, même pour tous les slogans

  lines.forEach(line => {
    ctx.fillText(line, 32, ty);
    ty += lineH;
  });

  // Sous-titre
  ctx.fillStyle = ac;
  ctx.font = 'bold 15px "Oswald", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(posterState.subtitle, 32, H - 48);

  // Année
  ctx.fillStyle = tc;
  ctx.font = 'bold 15px "Courier Prime", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(posterState.year, W - 32, H - 48);

  // Trait de pied
  ctx.strokeStyle = ac;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(30, H - 58);
  ctx.lineTo(W - 30, H - 58);
  ctx.stroke();

  // Grain halftone léger par-dessus tout
  applyGrain(ctx, W, H);
}

function applyGrain(ctx, W, H) {
  ctx.save();
  ctx.globalAlpha = 0.025;
  for (let y = 0; y < H; y += 5) {
    for (let x = 0; x < W; x += 5) {
      if (Math.random() > 0.6) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }
  }
  ctx.restore();
}

function downloadPoster() {
  drawPoster();
  const canvas = document.getElementById('poster-canvas');
  const link = document.createElement('a');
  link.download = 'affiche-revolutionnaire.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}


/* ─────────────────────────────────────────────
   3. QUIZ MUSICAL
───────────────────────────────────────────── */

const GRADES = [
  { min: 0,  max: 2,  grade: 'SYMPATHISANT',    desc: 'Tu as entendu parler de révolution, mais depuis ton canapé.' },
  { min: 3,  max: 4,  grade: 'MILITANT',         desc: 'Tu distribues des tracts, tu connais quelques hymnes. Bien.' },
  { min: 5,  max: 6,  grade: 'PARTISAN',         desc: 'Tu te bats dans l\'ombre. Les barricades te connaissent.' },
  { min: 7,  max: 8,  grade: 'RÉSISTANT',        desc: 'La musique est ton arme. L\'histoire te retient.' },
  { min: 9,  max: 9,  grade: 'RÉVOLUTIONNAIRE',  desc: 'Tu aurais sifflé le Chant des Partisans en plein couvre-feu.' },
  { min: 10, max: 10, grade: 'COMMANDANT',       desc: 'Parfait. Tu connais chaque note, chaque barricade, chaque cri.' }
];

// Questions : on pioche dans revolutionaryMusicSites (data.js)
let quizQuestions = [];
let quizCurrent   = 0;
let quizScore     = 0;
let quizAudio     = null;
let quizAnswered  = false;

function buildQuizQuestions() {
  const pool = typeof revolutionaryMusicSites !== 'undefined' ? revolutionaryMusicSites : [];
  // Filtre les entrées qui ont un audio
  const withAudio = pool.filter(s => s.audio);
  // Mélange
  const shuffled = [...withAudio].sort(() => Math.random() - 0.5);
  // 10 questions max
  const selected = shuffled.slice(0, Math.min(10, shuffled.length));

  return selected.map((correct, i) => {
    // 3 mauvaises réponses
    const others = pool.filter(s => s !== correct);
    const wrongs = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const choices = [...wrongs, correct].sort(() => Math.random() - 0.5);
    return { correct, choices };
  });
}

function startQuiz() {
  quizQuestions = buildQuizQuestions();
  quizCurrent   = 0;
  quizScore     = 0;
  updateScoreDisplay();
  document.getElementById('quiz-start-screen').classList.add('hidden');
  document.getElementById('quiz-question-screen').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  if (quizCurrent >= quizQuestions.length) { showResult(); return; }

  quizAnswered = false;
  stopQuizAudio();

  const q = quizQuestions[quizCurrent];
  document.getElementById('quiz-q-num').textContent = `Question ${quizCurrent + 1} / ${quizQuestions.length}`;

  // Flag emoji approximatif ou vide
  const flagEl = document.getElementById('quiz-country-flag');
  flagEl.textContent = '';

  // Bouton play
  const playBtn = document.getElementById('quiz-play-btn');
  playBtn.disabled = false;
  playBtn.querySelector('.play-label').textContent = 'Écouter l\'extrait (5 sec)';
  playBtn.querySelector('.play-icon').textContent = '▶';

  // Barre audio reset
  const bar = document.getElementById('quiz-audio-progress');
  bar.style.width = '0%';
  bar.style.transition = 'none';

  document.getElementById('quiz-played-hint').classList.add('hidden');
  document.getElementById('quiz-feedback').classList.add('hidden');

  // Choix
  const choicesEl = document.getElementById('quiz-choices');
  choicesEl.innerHTML = '';
  q.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-title">${choice.title}</span><span class="choice-meta">${choice.artist} — ${choice.year}</span>`;
    btn.onclick = () => answerQuestion(choice, btn);
    choicesEl.appendChild(btn);
  });

  // Progress bar du quiz
  const pct = (quizCurrent / quizQuestions.length) * 100;
  document.getElementById('quiz-progress-bar').style.width = pct + '%';
  document.getElementById('quiz-progress-text').textContent = `Question ${quizCurrent + 1} / ${quizQuestions.length}`;
}

function playQuizAudio() {
  stopQuizAudio();
  const q = quizQuestions[quizCurrent];

  const playBtn = document.getElementById('quiz-play-btn');
  const bar     = document.getElementById('quiz-audio-progress');

  playBtn.disabled = true;
  playBtn.querySelector('.play-icon').textContent = '⏳';
  playBtn.querySelector('.play-label').textContent = 'Chargement…';
  bar.style.transition = 'none';
  bar.style.width = '0%';

  quizAudio = new Audio(q.correct.audio);
  quizAudio.preload = 'auto';

  quizAudio.addEventListener('loadedmetadata', () => {
    // Sauter au milieu du morceau
    quizAudio.currentTime = quizAudio.duration / 2;
  });

  quizAudio.addEventListener('seeked', () => {
    quizAudio.play();
    playBtn.querySelector('.play-icon').textContent = '🔊';
    playBtn.querySelector('.play-label').textContent = 'En cours…';

    // Lancer la barre de progression sur 5s
    bar.style.transition = 'none';
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      bar.style.transition = 'width 5s linear';
      bar.style.width = '100%';
    });

    setTimeout(() => {
      stopQuizAudio();
      playBtn.disabled = false;
      playBtn.querySelector('.play-icon').textContent = '▶';
      playBtn.querySelector('.play-label').textContent = 'Réécouter';
      document.getElementById('quiz-played-hint').classList.remove('hidden');
    }, 5000);
  }, { once: true });
}

function stopQuizAudio() {
  if (quizAudio) { quizAudio.pause(); quizAudio.currentTime = 0; quizAudio = null; }
}

function answerQuestion(choice, btn) {
  if (quizAnswered) return;
  quizAnswered = true;
  stopQuizAudio();

  const correct = quizQuestions[quizCurrent].correct;
  const isRight = choice === correct;

  // Coloration des boutons
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    const bChoice = quizQuestions[quizCurrent].choices.find(c =>
      b.querySelector('.choice-title').textContent === c.title
    );
    if (bChoice === correct) b.classList.add('correct');
    else b.classList.add('wrong');
  });

  if (isRight) quizScore++;
  updateScoreDisplay();

  // Feedback
  const fb = document.getElementById('quiz-feedback');
  const fi = document.getElementById('quiz-feedback-inner');
  fb.classList.remove('hidden');
  fb.className = `quiz-feedback ${isRight ? 'feedback-right' : 'feedback-wrong'}`;

  if (isRight) {
    fi.innerHTML = `<strong>✔ Bonne réponse !</strong> — <em>${correct.title}</em> (${correct.artist}, ${correct.year})<br><small>${correct.desc}</small>`;
  } else {
    fi.innerHTML = `<strong>✘ Raté !</strong> C'était <em>${correct.title}</em> — ${correct.artist} (${correct.year})<br><small>${correct.desc}</small>`;
  }

  const nextBtn = document.getElementById('btn-next');
  nextBtn.textContent = quizCurrent + 1 < quizQuestions.length ? 'Question suivante →' : 'Voir mon résultat →';
}

function nextQuestion() {
  quizCurrent++;
  showQuestion();
}

function updateScoreDisplay() {
  document.getElementById('quiz-score').textContent = quizScore;
}

function showResult() {
  stopQuizAudio();
  document.getElementById('quiz-question-screen').classList.add('hidden');
  document.getElementById('quiz-result-screen').classList.remove('hidden');

  const grade = GRADES.find(g => quizScore >= g.min && quizScore <= g.max) || GRADES[GRADES.length - 1];

  document.getElementById('result-grade-badge').textContent = grade.grade;
  document.getElementById('result-score-big').textContent = `${quizScore} / ${quizQuestions.length}`;
  document.getElementById('result-desc').textContent = grade.desc;

  // Progress bar finale
  document.getElementById('quiz-progress-bar').style.width = '100%';

  // Liste des grades
  const list = document.getElementById('grade-list');
  list.innerHTML = '';
  GRADES.forEach(g => {
    const li = document.createElement('li');
    li.className = g.grade === grade.grade ? 'grade-current' : '';
    li.innerHTML = `<strong>${g.grade}</strong> — ${g.min}${g.max !== g.min ? '–' + g.max : ''} pts`;
    list.appendChild(li);
  });
}

function restartQuiz() {
  document.getElementById('quiz-result-screen').classList.add('hidden');
  document.getElementById('quiz-start-screen').classList.remove('hidden');
  quizScore = 0;
  quizCurrent = 0;
  updateScoreDisplay();
  document.getElementById('quiz-progress-bar').style.width = '0%';
}

// Smooth scroll des pills
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(pill.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
