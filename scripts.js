const startBtn = document.querySelector(".start");
let questionPage = document.querySelector(".questionPage");
const startPage = document.querySelector(".first");
let currentStage = document.querySelector(".currentStage");
const nextBtn = document.querySelector(".nextBtn");

startBtn.addEventListener("click", startQuizBtn);

function startQuizBtn() {
  console.log("started");
  questionPage.style.display = "block";
  startPage.style.display = "none";
  startQuiz();
}

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
      { text: "Markup Language", correct: false },
      { text: "Scripting Language", correct: false },
      { text: "Programming Language", correct: true },
      { text: "Working Language", correct: false },
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
];

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextBtn.innerHTML = "Next >";
  nextBtn.style.textAlign = "left";
  showQuestion();
}

const answerButtons = document.querySelector(".answers");

function resetPreviousQuestion() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

const questionElement = document.querySelector(".question");

function showQuestion() {
  resetPreviousQuestion();
  const currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1; // because index starts from 0 and we need from 1
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

function selectAnswer(e) {
  const selectedBtn = e.target;
  const correct = selectedBtn.dataset.correct === "true";

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    if (button === selectedBtn && !correct) {
      button.classList.add("incorrect");
      const span = document.createElement("span");
      // it creates the new span in out HTML page
      span.innerText = " You chose";
      span.classList.add("choice-indicator");
      selectedBtn.appendChild(span);
    // it adds the new span to the selectedBtn
    }
    button.disabled = true;
  });

  if (correct) {
    score++;
  }

  nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
    nextBtn.style.display = "none";
  } else {
    showResults();
    nextBtn.innerHTML = "Restart The Quiz >";
    nextBtn.style.textAlign = "center";
    nextBtn.addEventListener("click", startQuizBtn);
  }
});

function showResults() {
  resetPreviousQuestion();
  questionElement.innerHTML = `Quiz finished! Your score is ${score} out of ${questions.length}.`;
  currentStage.innerHTML = "";
  nextBtn.style.display = "none";
}
