// ════════════════════════════════════════════════════════════
// game.js — KBC Quiz Game Logic
// Shri Shashi High School Gorsi
// ════════════════════════════════════════════════════════════

// ── PRIZE LADDER (20 questions) ──
// Points double-ish like real KBC, but capped sensibly for a school quiz.
const PRIZE_LADDER = [
  100, 200, 300, 500, 1000,      // Q1-5   (easy zone)
  2000, 4000, 8000, 16000, 32000, // Q6-10  (safe checkpoint at Q10)
  64000, 125000, 250000, 500000, 1000000, // Q11-15 (checkpoint at Q15)
  2000000, 3000000, 5000000, 7000000, 10000000 // Q16-20 (final stretch)
];
const SAFE_CHECKPOINTS = [10, 15]; // 1-indexed question numbers that lock in prize money even if you quit/wrong after

const TOTAL_QUESTIONS = 20;
const SUBJECTS_POOL = ["Hindi", "English", "Science", "SocialScience", "GK", "Math"];

// ── GAME STATE ──
let state = {
  playerName: "",
  classLevel: "",
  currentQ: 0,           // 0-indexed, 0..19
  questions: [],         // the 20 chosen questions for this run
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  lifelines: { expert: true, audience: true, fiftyFifty: true },
  selectedOption: null,
  locked: false,         // true while answer is locked in / being revealed
  hiddenOptions: [],     // for 50-50: array of option-indices to hide
  history: []            // per-question record for results screen
};

// ════════════════════════════════════════════════════════════
// MATH QUESTION GENERATOR (calculative, random, class-aware)
// ════════════════════════════════════════════════════════════
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Builds a 4-option set around a correct numeric answer, with plausible
// wrong answers (close-by numbers), then shuffles position.
function buildNumericOptions(correctAnswer) {
  const wrongPool = new Set();
  while (wrongPool.size < 3) {
    const delta = randInt(1, Math.max(5, Math.abs(Math.round(correctAnswer * 0.2)) + 3));
    const sign = Math.random() > 0.5 ? 1 : -1;
    const candidate = correctAnswer + sign * delta;
    if (candidate !== correctAnswer) wrongPool.add(candidate);
  }
  const options = shuffle([correctAnswer, ...Array.from(wrongPool)]);
  return { options: options.map(String), answer: options.indexOf(correctAnswer) };
}

// Class 5-7: arithmetic (addition, subtraction, multiplication, simple division)
// Class 8-10: algebra / linear equations / percentages / simple exponents too
function generateMathQuestion(classLevel) {
  const cls = parseInt(classLevel, 10);

  if (cls <= 7) {
    const ops = ["+", "-", "×", "÷"];
    const op = ops[randInt(0, cls <= 5 ? 2 : 3)]; // class 5-6 skip division for simplicity
    let a, b, correctAnswer, qText;

    if (op === "+") {
      a = randInt(cls * 10, cls * 50); b = randInt(cls * 10, cls * 50);
      correctAnswer = a + b; qText = `${a} + ${b} = ?`;
    } else if (op === "-") {
      a = randInt(cls * 20, cls * 60); b = randInt(1, a);
      correctAnswer = a - b; qText = `${a} − ${b} = ?`;
    } else if (op === "×") {
      a = randInt(2, cls + 5); b = randInt(2, cls + 8);
      correctAnswer = a * b; qText = `${a} × ${b} = ?`;
    } else {
      b = randInt(2, 9); correctAnswer = randInt(2, cls * 5);
      a = b * correctAnswer; qText = `${a} ÷ ${b} = ?`;
    }
    const { options, answer } = buildNumericOptions(correctAnswer);
    return { q: `Calculate: ${qText}`, options, answer };
  }

  // Class 8-10: pick from a few question "templates" randomly
  const templateChoice = randInt(0, 3);

  if (templateChoice === 0) {
    // Linear equation: ax + b = c, solve for x
    const a = randInt(2, 9);
    const x = randInt(2, 15);
    const b = randInt(1, 20);
    const c = a * x + b;
    const { options, answer } = buildNumericOptions(x);
    return { q: `Solve for x: ${a}x + ${b} = ${c}`, options, answer };
  }

  if (templateChoice === 1) {
    // Percentage of a number
    const percentValues = [10, 20, 25, 40, 50, 75];
    const p = percentValues[randInt(0, percentValues.length - 1)];
    const base = randInt(2, 40) * 10; // round numbers
    const correctAnswer = Math.round((p / 100) * base);
    const { options, answer } = buildNumericOptions(correctAnswer);
    return { q: `What is ${p}% of ${base}?`, options, answer };
  }

  if (templateChoice === 2) {
    // Square / cube
    const useSquare = Math.random() > 0.4;
    const n = randInt(3, useSquare ? 20 : 10);
    const correctAnswer = useSquare ? n * n : n * n * n;
    const { options, answer } = buildNumericOptions(correctAnswer);
    return { q: useSquare ? `What is the square of ${n} (${n}²)?` : `What is the cube of ${n} (${n}³)?`, options, answer };
  }

  // templateChoice === 3: simple combined arithmetic (BODMAS-style)
  const a = randInt(2, 12), b = randInt(2, 12), c = randInt(2, 12);
  const correctAnswer = a * b + c;
  const { options, answer } = buildNumericOptions(correctAnswer);
  return { q: `Calculate: (${a} × ${b}) + ${c} = ?`, options, answer };
}

// ════════════════════════════════════════════════════════════
// QUESTION SELECTION — builds the 20-question run for this class
// ════════════════════════════════════════════════════════════
function pickQuestionsForClass(classLevel) {
  const bank = QUESTION_BANK[classLevel] || QUESTION_BANK["8"]; // fallback
  const picked = [];
  const usedTexts = new Set();

  // Build a subject sequence: mostly non-math subjects, with ~4-5 math
  // questions scattered in, weighted slightly harder toward the end (KBC style).
  const mathCount = 5;
  const otherCount = TOTAL_QUESTIONS - mathCount;
  const nonMathSubjects = ["Hindi", "English", "Science", "SocialScience", "GK"];

  // distribute otherCount questions across nonMathSubjects roughly evenly
  let subjectSequence = [];
  for (let i = 0; i < otherCount; i++) {
    subjectSequence.push(nonMathSubjects[i % nonMathSubjects.length]);
  }
  // insert "Math" at 5 roughly-spread positions
  const mathPositions = [2, 6, 10, 14, 17].map(p => Math.min(p, TOTAL_QUESTIONS - 1));
  let finalSequence = new Array(TOTAL_QUESTIONS).fill(null);
  mathPositions.forEach((pos, i) => { finalSequence[pos] = "Math"; });
  let si = 0;
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    if (finalSequence[i] === null) {
      finalSequence[i] = subjectSequence[si % subjectSequence.length];
      si++;
    }
  }

  finalSequence.forEach((subject, idx) => {
    if (subject === "Math") {
      picked.push({ ...generateMathQuestion(classLevel), subject: "Math", points: PRIZE_LADDER[idx] });
      return;
    }
    const pool = (bank[subject] || []).filter(item => !usedTexts.has(item.q));
    if (pool.length === 0) {
      // fallback: generate a math question if pool exhausted
      picked.push({ ...generateMathQuestion(classLevel), subject: "Math", points: PRIZE_LADDER[idx] });
      return;
    }
    const chosen = pool[randInt(0, pool.length - 1)];
    usedTexts.add(chosen.q);

    // Shuffle option order so correct answer isn't always position 0
    const correctText = chosen.options[chosen.answer];
    const shuffledOptions = shuffle(chosen.options);
    const newAnswerIndex = shuffledOptions.indexOf(correctText);

    picked.push({
      q: chosen.q,
      options: shuffledOptions,
      answer: newAnswerIndex,
      subject,
      points: PRIZE_LADDER[idx]
    });
  });

  return picked;
}

// ════════════════════════════════════════════════════════════
// GAME FLOW
// ════════════════════════════════════════════════════════════

function startGame(name, classLevel) {
  state = {
    playerName: name,
    classLevel,
    currentQ: 0,
    questions: pickQuestionsForClass(classLevel),
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    lifelines: { expert: true, audience: true, fiftyFifty: true },
    selectedOption: null,
    locked: false,
    hiddenOptions: [],
    history: []
  };
  renderQuestion();
  showScreen('gameScreen');
}

function getCurrentQuestion() {
  return state.questions[state.currentQ];
}

function getCurrentPrize() {
  return PRIZE_LADDER[state.currentQ];
}

function getSafeAmount() {
  // highest checkpoint already crossed (1-indexed question number <= currentQ)
  let safe = 0;
  SAFE_CHECKPOINTS.forEach(checkpoint => {
    if (state.currentQ >= checkpoint) safe = PRIZE_LADDER[checkpoint - 1];
  });
  return safe;
}

function selectOption(idx) {
  if (state.locked || state.hiddenOptions.includes(idx)) return;
  state.selectedOption = idx;
  renderOptions(); // re-render to show "locked-in" highlight
  document.getElementById('lockBtn').disabled = false;
}

function lockAnswer() {
  if (state.selectedOption === null || state.locked) return;
  state.locked = true;
  document.getElementById('lockBtn').disabled = true;

  const q = getCurrentQuestion();
  const isCorrect = state.selectedOption === q.answer;

  // Suspense delay before revealing (real KBC drumroll effect)
  document.getElementById('lockBtn').textContent = '⏳ Checking...';
  setTimeout(() => revealAnswer(isCorrect), 1600);
}

function revealAnswer(isCorrect) {
  const q = getCurrentQuestion();
  renderOptions(true); // highlight correct/wrong

  state.history.push({
    question: q.q,
    subject: q.subject,
    yourAnswer: state.selectedOption !== null ? q.options[state.selectedOption] : "—",
    correctAnswer: q.options[q.answer],
    correct: isCorrect,
    points: q.points
  });

  if (isCorrect) {
    state.score = q.points;
    state.correctCount++;
    document.getElementById('resultBanner').textContent = '🎉 Correct Answer!';
    document.getElementById('resultBanner').className = 'result-banner correct show';
    updateMoneyDisplay();
    setTimeout(() => {
      if (state.currentQ === TOTAL_QUESTIONS - 1) {
        endGame('won');
      } else {
        state.currentQ++;
        state.selectedOption = null;
        state.locked = false;
        state.hiddenOptions = [];
        renderQuestion();
      }
    }, 1800);
  } else {
    state.wrongCount++;
    document.getElementById('resultBanner').textContent = '❌ Wrong Answer!';
    document.getElementById('resultBanner').className = 'result-banner wrong show';
    state.score = getSafeAmount();
    setTimeout(() => endGame('lost'), 2200);
  }
}

function quitWithMoney() {
  if (state.locked) return;
  state.score = state.currentQ === 0 ? 0 : PRIZE_LADDER[state.currentQ - 1];
  endGame('quit');
}

function endGame(reason) {
  showScreen('resultScreen');
  renderResultScreen(reason);
}

// ════════════════════════════════════════════════════════════
// LIFELINES
// ════════════════════════════════════════════════════════════

function useFiftyFifty() {
  if (!state.lifelines.fiftyFifty || state.locked) return;
  state.lifelines.fiftyFifty = false;
  document.getElementById('lifeline-fifty').classList.add('used');

  const q = getCurrentQuestion();
  const wrongIndexes = [0, 1, 2, 3].filter(i => i !== q.answer);
  const toHide = shuffle(wrongIndexes).slice(0, 2);
  state.hiddenOptions = toHide;
  renderOptions();
}

function useAudiencePoll() {
  if (!state.lifelines.audience || state.locked) return;
  state.lifelines.audience = false;
  document.getElementById('lifeline-audience').classList.add('used');

  const q = getCurrentQuestion();
  // Smart simulation: correct answer gets a strong but not-always-overwhelming
  // majority, remaining % split across wrong (and hidden, if 50-50 used) options.
  const visibleIndexes = [0, 1, 2, 3].filter(i => !state.hiddenOptions.includes(i));
  let percentages = {};

  const correctShare = randInt(45, 72); // correct answer gets a strong lead, but not certain
  percentages[q.answer] = correctShare;

  const remaining = visibleIndexes.filter(i => i !== q.answer);
  let leftover = 100 - correctShare;
  remaining.forEach((idx, i) => {
    if (i === remaining.length - 1) {
      percentages[idx] = leftover;
    } else {
      const share = randInt(0, leftover);
      percentages[idx] = share;
      leftover -= share;
    }
  });

  showAudienceModal(percentages, visibleIndexes);
}

function useExpertAdvice() {
  if (!state.lifelines.expert || state.locked) return;
  state.lifelines.expert = false;
  document.getElementById('lifeline-expert').classList.add('used');

  const q = getCurrentQuestion();
  const letterMap = ['A', 'B', 'C', 'D'];
  const expertMessages = [
    `मुझे लगता है इस सवाल का जवाब option ${letterMap[q.answer]} होना चाहिए — मैंने इस टॉपिक को पहले पढ़ा है।`,
    `Based on my knowledge, I'm fairly confident the answer is option ${letterMap[q.answer]}.`,
    `यह एक classic question है। Option ${letterMap[q.answer]} सही उत्तर लगता है मुझे।`,
  ];
  const msg = expertMessages[randInt(0, expertMessages.length - 1)];
  showExpertModal(msg);
}

// ════════════════════════════════════════════════════════════
// EXPORTS (used by ui.js)
// ════════════════════════════════════════════════════════════
window.KBC = {
  get state() { return state; },
  startGame, getCurrentQuestion, getCurrentPrize, getSafeAmount,
  selectOption, lockAnswer, quitWithMoney,
  useFiftyFifty, useAudiencePoll, useExpertAdvice,
  PRIZE_LADDER, SAFE_CHECKPOINTS, TOTAL_QUESTIONS
};
