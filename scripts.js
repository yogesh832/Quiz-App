// Select necessary DOM elements
const startBtn = document.querySelector(".start");
let questionPage = document.querySelector(".questionPage");
const startPage = document.querySelector(".first");
let currentStage = document.querySelector(".currentStage");
const nextBtn = document.querySelector(".nextBtn");

// Add event listener to start button
startBtn.addEventListener("click", startQuizBtn);

function startQuizBtn() {
  console.log("started");
  // Show the question page and hide the start page
  questionPage.style.display = "block";
  startPage.style.display = "none";
  // Start the quiz
  startQuiz();
}

// Array of quiz questions
const questions = [
  {
    question: "What is HTML?",
    answer: [
      { text: "Markup Language", correct: true },
      { text: "Scripting Language", correct: false },
      { text: "Programming Language", correct: false },
      { text: "Working Language", correct: false },
    ],
  },
  {
    question: "What is CSS?",
    answer: [
      { text: "Scripting Language", correct: false },
      { text: "Working Language", correct: false },
      { text: "Markup Language", correct: false },
      { text: "Programming Language", correct: true },
    ],
  },
  {
    question: "What is JS?",
    answer: [
      { text: "Markup Language", correct: false },
      { text: "Scripting Language", correct: true },
      { text: "Programming Language", correct: false },
      { text: "Working Language", correct: false },
    ],
  },
  {
    question: "What is PHP?",
    answer: [
      { text: "Markup Language", correct: false },
      { text: "Scripting Language", correct: true },
      { text: "Programming Language", correct: false },
      { text: "Working Language", correct: false },
    ],
  },
  {
    question: "What is Python?",
    answer: [
      { text: "Markup Language", correct: false },
      { text: "Scripting Language", correct: false },
      { text: "Programming Language", correct: true },
      { text: "Working Language", correct: false },
    ],
  },
  {
    question: "What is the full form of HTML?",
    answer: [
      { text: "Hyper text markup language", correct: true },
      { text: "hyper type markup language", correct: false },
      { text: "hii type marking language", correct: false },
      { text: "hyper text marking language", correct: false },
    ],
  },
];

let currentQuestionIndex = 0; // To keep track of current question index
let score = 0; // To keep track of the user's score

const timerElement = document.querySelector(".timer");
let timerInterval; // To store the interval ID
let time = 30; // Initial time for each question

// Load audio elements
const winningAudio = new Audio("winning.wav");
const losingAudio = new Audio("loosing.mp3");

// Function to start the timer
function startTimer() {
  if (time > 0) {
    time--;
    timerElement.innerHTML = `00:${time < 10 ? "0" : ""}${time}`;
  } else {
    clearInterval(timerInterval);
    nextQuestion(); // Show next question when timer reaches 0
  }

  const container = document.querySelector(".quiz");
  const upperContainer = document.querySelector(".upper");

  // Check if the time is less than 15 seconds and add the half-time class
  if (time < 15) {
    questionPage.classList.add("half-time");
    container.classList.add("half-time");
    upperContainer.classList.add("half-time");
  } else {
    questionPage.classList.remove("half-time");
    container.classList.remove("half-time");
    upperContainer.classList.remove("half-time");
  }

  // Check if the time is less than 7 seconds and add the end-time class
  if (time < 7) {
    questionPage.classList.add("end-time");
    container.classList.add("end-time");
    upperContainer.classList.add("end-time");
  } else {
    questionPage.classList.remove("end-time");
    container.classList.remove("end-time");
    upperContainer.classList.remove("end-time");
  }
}

// Function to reset and start the timer for each question
function resetTimer() {
  clearInterval(timerInterval);
  time = 30;
  timerElement.innerHTML = `00:${time < 10 ? "0" : ""}${time}`;
  timerInterval = setInterval(startTimer, 1000);
}

// Function to start the quiz
function startQuiz() {
  loadProgress(); // Load saved progress if any
  if (currentQuestionIndex >= questions.length) {
    // If the quiz was completed in the previous session, reset it
    currentQuestionIndex = 0;
    score = 0;
  }
  nextBtn.innerHTML = "Next >";
  nextBtn.style.textAlign = "left";
  showQuestion();
}

// Select the answers container
const answerButtons = document.querySelector(".answers");

// Function to remove previous question's answers
function resetPreviousQuestion() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

// Select the question element
const questionElement = document.querySelector(".question");

// Function to show a question
function showQuestion() {
  resetPreviousQuestion();
  resetTimer(); // Reset the timer for the new question

  const currentQuestion = questions[currentQuestionIndex];
  const questionNo = currentQuestionIndex + 1; // Question number (1-based index)
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answer.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });

  currentStage.innerHTML = questionNo + " / " + questions.length;
}

// Function to handle answer selection
function selectAnswer(e) {
  const selectedBtn = e.target;
  const correct = selectedBtn.dataset.correct === "true";

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
      winningAudio.play();
    }
    if (button === selectedBtn && !correct) {
      button.classList.add("incorrect");
      const span = document.createElement("span");
      span.innerText = " You chose";
      span.classList.add("choice-indicator");
      selectedBtn.appendChild(span);
      winningAudio.pause();
      losingAudio.play();
    }
    button.disabled = true;
  });

  if (correct) {
    score++;
  }

  nextBtn.style.display = "block";
  clearInterval(timerInterval); // Stop timer when answer is selected
}

// Add event listener to the next button
nextBtn.addEventListener("click", nextQuestion);

// Function to show the next question
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
    nextBtn.style.display = "none";
    saveProgress(); // Save progress to local storage
  } else {
    showResults();
    nextBtn.innerHTML = "Restart The Quiz >";
    nextBtn.style.textAlign = "center";
    nextBtn.removeEventListener("click", nextQuestion);
    nextBtn.addEventListener("click", startQuizBtn);
    clearProgress(); // Clear progress from local storage when quiz ends
  }
}

// Function to show the results
function showResults() {
  resetPreviousQuestion();

  var result = document.querySelector(".result");
  result.style.display = "block";
  questionElement.innerHTML = `Quiz finished! Your score is ${score} out of ${questions.length}.`;

  currentStage.style.display = "none";
  answerButtons.style.display = "none";
  nextBtn.style.display = "none";
  var questionText = document.querySelector('.question');
  timerElement.style.display = "none";
  questionText.style.height = "150px";
  var scoreText = document.querySelector('.score-text');
  scoreText.innerHTML = `Keep learning, you are doing well🤗.`;
  let progressBar = document.querySelector('.correct-bar');
  progressBar.style.width = `${(score / questions.length) * 100}%`;
}

// Function to save progress to local storage
function saveProgress() {
  const progress = {
    currentQuestionIndex,
    score,
  };
  localStorage.setItem("quizProgress", JSON.stringify(progress));
}

// Function to load progress from local storage
function loadProgress() {
  const savedProgress = localStorage.getItem("quizProgress");
  if (savedProgress) {
    const progress = JSON.parse(savedProgress);
    currentQuestionIndex = progress.currentQuestionIndex;
    score = progress.score;
  }
}

// Function to clear progress from local storage
function clearProgress() {
  localStorage.removeItem("quizProgress");
}

// Load saved progress when the page loads
window.addEventListener("load", () => {
  loadProgress();
  if (currentQuestionIndex > 0 && currentQuestionIndex < questions.length) {
    questionPage.style.display = "block";
    startPage.style.display = "none";
    showQuestion();
  }
});
