/**
 * QuizCraft — script.js
 * Professional Quiz Game Application
 * Project: SkillCraft Technology Internship
 */
 
// ═══════════════════════════════════════
// QUESTIONS DATA
// ═══════════════════════════════════════
 
const questions = [
  {
    question: "Which language is primarily used for styling web pages?",
    options: ["HTML", "JavaScript", "CSS", "Python"],
    correct: 2
  },
  {
    question: "What does DOM stand for in web development?",
    options: [
      "Document Object Model",
      "Data Object Management",
      "Display Output Mode",
      "Document Oriented Markup"
    ],
    correct: 0
  },
  {
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Undefined"],
    correct: 2
  },
  {
    question: "Which HTML tag is used to link an external CSS file?",
    options: ["<style>", "<script>", "<link>", "<css>"],
    correct: 2
  },
  {
    question: "What does the 'R' in REST API stand for?",
    options: ["Remote", "Representational", "Relational", "Recursive"],
    correct: 1
  },
  {
    question: "Which method is used to add an element at the end of a JavaScript array?",
    options: ["append()", "push()", "add()", "insert()"],
    correct: 1
  },
  {
    question: "In CSS, which property controls the space between an element's border and its content?",
    options: ["margin", "spacing", "padding", "gap"],
    correct: 2
  },
  {
    question: "Which React hook is used to manage component state?",
    options: ["useEffect", "useContext", "useRef", "useState"],
    correct: 3
  },
  {
    question: "What is the correct way to declare a constant in JavaScript?",
    options: ["var x = 5", "let x = 5", "const x = 5", "static x = 5"],
    correct: 2
  },
  {
    question: "Which HTTP method is typically used to retrieve data from a server?",
    options: ["POST", "PUT", "DELETE", "GET"],
    correct: 3
  }
];
 
// ═══════════════════════════════════════
// CONSTANTS & STATE
// ═══════════════════════════════════════
 
const TIMER_SECONDS = 10;
const OPTION_LETTERS = ["A", "B", "C", "D"];
const CIRCUMFERENCE = 100; // SVG stroke-dasharray value
 
let currentIndex = 0;
let score = 0;
let answered = false;
let timerInterval = null;
let timeLeft = TIMER_SECONDS;
let userAnswers = []; // stores { selected, correct } for breakdown
 
// ═══════════════════════════════════════
// DOM REFERENCES
// ═══════════════════════════════════════
 
const startScreen     = document.getElementById("start-screen");
const quizScreen      = document.getElementById("quiz-screen");
const resultScreen    = document.getElementById("result-screen");
 
const startBtn        = document.getElementById("start-btn");
const nextBtn         = document.getElementById("next-btn");
const restartBtn      = document.getElementById("restart-btn");
 
const questionCounter = document.getElementById("question-counter");
const questionText    = document.getElementById("question-text");
const optionsGrid     = document.getElementById("options-grid");
const progressBar     = document.getElementById("progress-bar");
const timerDisplay    = document.getElementById("timer-display");
const timerRingFill   = document.getElementById("timer-ring-fill");
 
const resultTrophy    = document.getElementById("result-trophy");
const resultTitle     = document.getElementById("result-title");
const scoreFraction   = document.getElementById("score-fraction");
const scorePercent    = document.getElementById("score-percent");
const resultMessage   = document.getElementById("result-message");
const resultBreakdown = document.getElementById("result-breakdown");
 
// ═══════════════════════════════════════
// SCREEN MANAGEMENT
// ═══════════════════════════════════════
 
/**
 * Shows the specified screen by id, hides others.
 * @param {string} screenId - id of the screen element to show
 */
function showScreen(screenId) {
  [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}
 
// ═══════════════════════════════════════
// QUIZ LOGIC
// ═══════════════════════════════════════
 
/**
 * Initialises or resets quiz state and shows first question.
 */
function startQuiz() {
  currentIndex = 0;
  score = 0;
  answered = false;
  userAnswers = [];
  showScreen("quiz-screen");
  loadQuestion();
}
 
/**
 * Loads the current question onto the screen with animation.
 */
function loadQuestion() {
  answered = false;
  nextBtn.classList.add("hidden");
 
  const q = questions[currentIndex];
 
  // Counter
  questionCounter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
 
  // Progress bar
  const progressPct = (currentIndex / questions.length) * 100;
  progressBar.style.width = `${progressPct}%`;
 
  // Question text
  questionText.textContent = q.question;
 
  // Build options
  optionsGrid.innerHTML = "";
  q.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.setAttribute("data-index", i);
    btn.innerHTML = `
      <span class="option-letter">${OPTION_LETTERS[i]}</span>
      <span class="option-text">${option}</span>
    `;
    btn.addEventListener("click", () => checkAnswer(i));
    optionsGrid.appendChild(btn);
  });
 
  // Start timer
  startTimer();
}
 
/**
 * Starts the countdown timer for the current question.
 */
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIMER_SECONDS;
  updateTimerDisplay();
 
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
 
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeExpired();
    }
  }, 1000);
}
 
/**
 * Updates the timer number and SVG ring progress.
 */
function updateTimerDisplay() {
  timerDisplay.textContent = timeLeft;
 
  // Ring offset: 0 = full, 100 = empty
  const offset = CIRCUMFERENCE - (timeLeft / TIMER_SECONDS) * CIRCUMFERENCE;
  timerRingFill.style.strokeDashoffset = offset;
 
  // Danger colour when ≤ 3 seconds
  if (timeLeft <= 3) {
    timerRingFill.classList.add("danger");
  } else {
    timerRingFill.classList.remove("danger");
  }
}
 
/**
 * Called when the timer reaches zero — marks question as skipped.
 */
function timeExpired() {
  if (answered) return;
  answered = true;
 
  // Reveal correct answer
  const correctIndex = questions[currentIndex].correct;
  const allBtns = optionsGrid.querySelectorAll(".option-btn");
  allBtns[correctIndex].classList.add("correct");
  allBtns.forEach(btn => (btn.disabled = true));
 
  // Record as skipped (no selection)
  userAnswers.push({ selected: -1, correct: correctIndex });
 
  nextBtn.classList.remove("hidden");
}
 
/**
 * Checks the selected answer, highlights correct/wrong, updates score.
 * @param {number} selectedIndex - index of the chosen option
 */
function checkAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);
 
  const correctIndex = questions[currentIndex].correct;
  const allBtns = optionsGrid.querySelectorAll(".option-btn");
 
  // Highlight chosen option
  if (selectedIndex === correctIndex) {
    allBtns[selectedIndex].classList.add("correct");
    score++;
  } else {
    allBtns[selectedIndex].classList.add("wrong");
    allBtns[correctIndex].classList.add("correct");
  }
 
  // Disable all buttons
  allBtns.forEach(btn => (btn.disabled = true));
 
  // Record answer
  userAnswers.push({ selected: selectedIndex, correct: correctIndex });
 
  nextBtn.classList.remove("hidden");
}
 
/**
 * Moves to the next question or shows the result screen.
 */
function nextQuestion() {
  currentIndex++;
 
  if (currentIndex >= questions.length) {
    showResult();
    return;
  }
 
  // Slide-out animation then load next
  const card = document.querySelector(".quiz-card");
  card.classList.add("slide-out");
 
  setTimeout(() => {
    card.classList.remove("slide-out");
    loadQuestion();
  }, 250);
}
 
// ═══════════════════════════════════════
// RESULT SCREEN
// ═══════════════════════════════════════
 
/**
 * Displays the final score screen with grade, message, and breakdown.
 */
function showResult() {
  clearInterval(timerInterval);
 
  // Final progress = 100%
  progressBar.style.width = "100%";
 
  const total = questions.length;
  const pct   = Math.round((score / total) * 100);
 
  // Grade config
  const grades = [
    { min: 90, emoji: "🏆", title: "Outstanding!",    msg: "You absolutely nailed it. Perfect mastery of the subject — brilliant work!" },
    { min: 70, emoji: "⭐", title: "Great Job!",       msg: "Strong performance! You clearly know your stuff. Keep it up!" },
    { min: 50, emoji: "👍", title: "Good Effort!",     msg: "A solid attempt. A little more practice and you'll be unstoppable." },
    { min: 30, emoji: "📚", title: "Keep Learning!",   msg: "A fair try! Review the topics and come back stronger next time." },
    { min:  0, emoji: "💪", title: "Don't Give Up!",   msg: "Every expert was once a beginner. Study hard and try again!" }
  ];
 
  const grade = grades.find(g => pct >= g.min);
 
  resultTrophy.textContent   = grade.emoji;
  resultTitle.textContent    = grade.title;
  scoreFraction.textContent  = `${score} / ${total}`;
  scorePercent.textContent   = `${pct}%`;
  resultMessage.textContent  = grade.msg;
 
  // Build breakdown dots
  resultBreakdown.innerHTML = "";
  userAnswers.forEach(ans => {
    const dot = document.createElement("div");
    dot.className = "bd-dot";
    if (ans.selected === -1)               dot.classList.add("s"); // skipped
    else if (ans.selected === ans.correct) dot.classList.add("c"); // correct
    else                                   dot.classList.add("w"); // wrong
    resultBreakdown.appendChild(dot);
  });
 
  showScreen("result-screen");
}
 
// ═══════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════
 
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startQuiz);