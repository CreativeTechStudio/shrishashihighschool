// ════════════════════════════════════════════════════════════
// ui.js — Rendering & DOM logic for KBC Quiz Game
// Shri Shashi High School Gorsi
// ════════════════════════════════════════════════════════════

const SUBJECT_LABELS = {
  Hindi: "हिंदी",
  English: "English",
  Science: "विज्ञान",
  SocialScience: "सामाजिक विज्ञान",
  GK: "सामान्य ज्ञान",
  Math: "गणित"
};
const SUBJECT_ICONS = {
  Hindi: "📖", English: "🔤", Science: "🔬",
  SocialScience: "🌍", GK: "💡", Math: "🔢"
};

function formatMoney(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── PRIZE LADDER SIDEBAR ──
function renderLadder() {
  const ladder = document.getElementById('prizeLadder');
  let html = '';
  for (let i = KBC.TOTAL_QUESTIONS - 1; i >= 0; i--) {
    const qNum = i + 1;
    const isCurrent = i === KBC.state.currentQ;
    const isPassed = i < KBC.state.currentQ;
    const isCheckpoint = KBC.SAFE_CHECKPOINTS.includes(qNum);
    html += `<div class="ladder-row ${isCurrent ? 'current' : ''} ${isPassed ? 'passed' : ''} ${isCheckpoint ? 'checkpoint' : ''}">
      <span class="ladder-num">${qNum}</span>
      <span class="ladder-amt">${formatMoney(KBC.PRIZE_LADDER[i])}</span>
    </div>`;
  }
  ladder.innerHTML = html;
  // auto-scroll current row into view
  setTimeout(() => {
    const current = ladder.querySelector('.current');
    if (current) current.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, 100);
}

// ── QUESTION RENDER ──
function renderQuestion() {
  const q = KBC.getCurrentQuestion();
  document.getElementById('qNumber').textContent = `Question ${KBC.state.currentQ + 1} / ${KBC.TOTAL_QUESTIONS}`;
  document.getElementById('qPrize').textContent = formatMoney(KBC.getCurrentPrize());
  document.getElementById('qSubjectBadge').innerHTML = `${SUBJECT_ICONS[q.subject] || '❓'} ${SUBJECT_LABELS[q.subject] || q.subject}`;
  document.getElementById('qText').textContent = q.q;
  document.getElementById('playerNameDisplay').textContent = KBC.state.playerName;
  document.getElementById('playerClassDisplay').textContent = `Class ${KBC.state.classLevel}`;
  document.getElementById('playerAvatarLetter').textContent = (KBC.state.playerName[0] || 'A').toUpperCase();
  document.getElementById('safeAmountDisplay').textContent = formatMoney(KBC.getSafeAmount());

  // Reset lifeline buttons visually at the start of a fresh game (Q1)
  if (KBC.state.currentQ === 0) {
    document.getElementById('lifeline-fifty').classList.remove('used');
    document.getElementById('lifeline-audience').classList.remove('used');
    document.getElementById('lifeline-expert').classList.remove('used');
  }

  document.getElementById('resultBanner').className = 'result-banner';
  document.getElementById('resultBanner').textContent = '';
  document.getElementById('lockBtn').disabled = true;
  document.getElementById('lockBtn').textContent = '🔒 Lock Answer';

  renderOptions();
  renderLadder();
  updateMoneyDisplay();

  // animate question entrance
  const card = document.getElementById('questionCard');
  card.classList.remove('q-enter');
  void card.offsetWidth; // reflow to restart animation
  card.classList.add('q-enter');
}

function renderOptions(revealed = false) {
  const q = KBC.getCurrentQuestion();
  const letters = ['A', 'B', 'C', 'D'];
  const wrap = document.getElementById('optionsGrid');
  wrap.innerHTML = q.options.map((opt, idx) => {
    const isHidden = KBC.state.hiddenOptions.includes(idx);
    const isSelected = KBC.state.selectedOption === idx;
    let cls = 'option-btn';
    if (isHidden) cls += ' hidden-option';
    if (isSelected && !revealed) cls += ' selected';
    if (revealed) {
      if (idx === q.answer) cls += ' correct-reveal';
      else if (isSelected) cls += ' wrong-reveal';
    }
    return `<button class="${cls}" ${isHidden || revealed ? 'disabled' : ''} onclick="KBC.selectOption(${idx})">
      <span class="opt-letter">${letters[idx]}</span><span class="opt-text">${isHidden ? '' : opt}</span>
    </button>`;
  }).join('');
}

function updateMoneyDisplay() {
  document.getElementById('currentMoneyDisplay').textContent = formatMoney(KBC.state.score || (KBC.state.currentQ === 0 ? 0 : KBC.PRIZE_LADDER[KBC.state.currentQ - 1]));
}

// ── LIFELINE MODALS ──
function showExpertModal(message) {
  document.getElementById('expertMessage').textContent = message;
  document.getElementById('expertModal').classList.add('open');
}
function closeExpertModal() {
  document.getElementById('expertModal').classList.remove('open');
}

function showAudienceModal(percentages, visibleIndexes) {
  const q = KBC.getCurrentQuestion();
  const letters = ['A', 'B', 'C', 'D'];
  const wrap = document.getElementById('audienceBars');
  wrap.innerHTML = visibleIndexes.map(idx => {
    const pct = percentages[idx] || 0;
    return `<div class="audience-row">
      <span class="audience-letter">${letters[idx]}</span>
      <div class="audience-track"><div class="audience-fill" style="width:0%" data-pct="${pct}"></div></div>
      <span class="audience-pct">${pct}%</span>
    </div>`;
  }).join('');
  document.getElementById('audienceModal').classList.add('open');
  // animate bars filling in after modal opens
  setTimeout(() => {
    document.querySelectorAll('.audience-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  }, 150);
}
function closeAudienceModal() {
  document.getElementById('audienceModal').classList.remove('open');
}

// ── RESULT SCREEN ──
function renderResultScreen(reason) {
  const won20 = reason === 'won';
  document.getElementById('resultIcon').textContent = won20 ? '🏆' : (reason === 'quit' ? '🚪' : '💔');
  document.getElementById('resultTitle').textContent = won20
    ? 'बधाई हो! आपने सभी 20 प्रश्न जीत लिए!'
    : reason === 'quit'
      ? 'आपने खेल बीच में छोड़ दिया।'
      : 'खेल समाप्त — गलत उत्तर!';
  document.getElementById('resultPlayerName').textContent = KBC.state.playerName;
  document.getElementById('resultPlayerClass').textContent = `Class ${KBC.state.classLevel}`;
  document.getElementById('resultMoney').textContent = formatMoney(KBC.state.score);
  document.getElementById('resultCorrect').textContent = KBC.state.correctCount;
  document.getElementById('resultWrong').textContent = KBC.state.wrongCount;
  document.getElementById('resultQuestionsReached').textContent = `${KBC.state.currentQ + (reason === 'won' ? 1 : (KBC.state.history.length))} / ${KBC.TOTAL_QUESTIONS}`;

  // subject-wise breakdown
  const subjectStats = {};
  KBC.state.history.forEach(h => {
    if (!subjectStats[h.subject]) subjectStats[h.subject] = { correct: 0, total: 0 };
    subjectStats[h.subject].total++;
    if (h.correct) subjectStats[h.subject].correct++;
  });
  const breakdownWrap = document.getElementById('subjectBreakdown');
  breakdownWrap.innerHTML = Object.keys(subjectStats).map(subj => {
    const s = subjectStats[subj];
    return `<div class="breakdown-item">
      <span class="breakdown-icon">${SUBJECT_ICONS[subj] || '❓'}</span>
      <span class="breakdown-label">${SUBJECT_LABELS[subj] || subj}</span>
      <span class="breakdown-score">${s.correct}/${s.total}</span>
    </div>`;
  }).join('');

  // full question history (review)
  const histWrap = document.getElementById('historyList');
  histWrap.innerHTML = KBC.state.history.map((h, i) => `
    <div class="history-item ${h.correct ? 'history-correct' : 'history-wrong'}">
      <div class="history-q-num">Q${i + 1}</div>
      <div class="history-q-body">
        <div class="history-q-text">${h.question}</div>
        <div class="history-ans-row">
          <span>आपका उत्तर: <strong>${h.yourAnswer}</strong></span>
          ${!h.correct ? `<span>सही उत्तर: <strong>${h.correctAnswer}</strong></span>` : ''}
        </div>
      </div>
      <div class="history-icon">${h.correct ? '✅' : '❌'}</div>
    </div>
  `).join('');
}

// ── SETUP SCREEN ──
function goToSetup() {
  showScreen('setupScreen');
}

function beginGameFromSetup() {
  const nameInput = document.getElementById('playerNameInput');
  const name = nameInput.value.trim();
  const selectedClass = document.querySelector('.class-pill.active');

  document.getElementById('nameError').style.display = 'none';
  document.getElementById('classError').style.display = 'none';

  let valid = true;
  if (!name) {
    document.getElementById('nameError').style.display = 'block';
    valid = false;
  }
  if (!selectedClass) {
    document.getElementById('classError').style.display = 'block';
    valid = false;
  }
  if (!valid) return;

  const classLevel = selectedClass.dataset.class;
  KBC.startGame(name, classLevel);
}

function selectClassPill(el) {
  document.querySelectorAll('.class-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('classError').style.display = 'none';
}

function restartGame() {
  showScreen('welcomeScreen');
  document.getElementById('playerNameInput').value = '';
  document.querySelectorAll('.class-pill').forEach(p => p.classList.remove('active'));
}

// confirm before quitting mid-game
function confirmQuit() {
  if (confirm('क्या आप वाकई गेम छोड़ना चाहते हैं? आपका वर्तमान स्कोर सुरक्षित रहेगा।')) {
    KBC.quitWithMoney();
  }
}
