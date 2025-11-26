// ===== Quiz data =====
const quizData = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    answer: "New Delhi",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Python", "Java", "C++", "JavaScript"],
    answer: "JavaScript",
  },
  {
    question: "Who wrote the national anthem of India?",
    options: [
      "Rabindranath Tagore",
      "Bankim Chandra Chatterjee",
      "Mahatma Gandhi",
      "Subhash Chandra Bose",
    ],
    answer: "Rabindranath Tagore",
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    answer: "Blue Whale",
  },
];

// ===== DOM elements =====
const start = document.getElementById("start-btn");
const firstScreen = document.getElementById("first-screen");
const secondScreen = document.getElementById("second-screen");
const optionDiv = document.getElementById("options");
const questionText = document.getElementById("question-text");
const progressBar = document.getElementById("progressBar");
const timerDisplay = document.getElementById("timerDisplay");
const scoreDisplay = document.getElementById("score");
const currentQuestionDisplay = document.getElementById("current-question");
const totalQuestionsDisplay = document.getElementById("total-questions");
const bottomText = document.getElementById("bottom-text");

// ===== quiz state =====
let currentQuestion = 0;
let timerInterval = null;
let score = 0;
const TIME_PER_QUESTION = 10; // seconds

// Initialize total questions display
totalQuestionsDisplay.textContent = quizData.length;

// Start button
start.addEventListener("click", () => {
  firstScreen.classList.add("hidden");
  secondScreen.classList.remove("hidden");
  startQuiz();
});

// Start quiz
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  updateScoreDisplay();
  loadQuestion();
}

// Load question + options
function loadQuestion() {
  // Add safety checks
  if (!quizData || !questionText || !optionDiv) {
    console.error("Missing required elements or data");
    return;
  }

  if (currentQuestion < 0 || currentQuestion >= quizData.length) {
    console.error("Current question index out of bounds");
    return;
  }

  const current = quizData[currentQuestion];

  // Update current question display
  currentQuestionDisplay.textContent = currentQuestion + 1;

  // Clear any existing timer first
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Set question text
  questionText.textContent = current.question;

  // Load options
  optionDiv.innerHTML = "";
  current.options.forEach((opt, index) => {
    const optionButton = document.createElement("button");
    optionButton.className =
      "bg-white border-2 border-purple-200 rounded-2xl p-4 text-left option-hover hover:border-purple-400 transition-all duration-300 flex items-start";
    optionButton.innerHTML = `
                    <span class="bg-purple-100 text-purple-700 rounded-lg w-8 h-8 flex items-center justify-center mr-3 font-bold flex-shrink-0">${String.fromCharCode(
                      65 + index
                    )}</span>
                    <span>${opt}</span>
                `;

    optionButton.addEventListener("click", () => {
      // Clear timer
      clearInterval(timerInterval);

      // Disable all buttons to prevent multiple clicks
      const allOptions = optionDiv.querySelectorAll("button");
      allOptions.forEach((btn) => {
        btn.classList.remove("hover:border-purple-400", "option-hover");
        btn.classList.add("cursor-default");
      });

      // Check answer and provide proper feedback
      if (opt === current.answer) {
        optionButton.classList.remove("border-purple-200", "bg-white");
        optionButton.classList.add("border-green-500", "bg-green-50");
        score++;
        updateScoreDisplay();
      } else {
        optionButton.classList.remove("border-purple-200", "bg-white");
        optionButton.classList.add("border-red-500", "bg-red-50");

        // Highlight correct answer
        allOptions.forEach((btn) => {
          if (
            btn.querySelector("span:last-child").textContent === current.answer
          ) {
            btn.classList.remove("border-purple-200", "bg-white");
            btn.classList.add("border-green-500", "bg-green-50");
          }
        });
      }

      setTimeout(nextQuestion, 1500);
    });

    optionDiv.appendChild(optionButton);
  });

  // Start timer for this question
  startTimer();
}

// Timer function (10 seconds)
function startTimer() {
  clearInterval(timerInterval);

  let timeLeft = TIME_PER_QUESTION;
  let elapsed = 0;

  progressBar.style.width = "0%";
  progressBar.classList.remove("bg-red-500");
  progressBar.classList.add("bg-yellow-400");
  timerDisplay.textContent = `${timeLeft}s`;

  timerInterval = setInterval(() => {
    elapsed++;
    timeLeft--;

    // update bar
    const progress = (elapsed / TIME_PER_QUESTION) * 100;
    progressBar.style.width = `${progress}%`;

    // Change color when time is running out
    if (timeLeft <= 3) {
      progressBar.classList.remove("bg-yellow-400");
      progressBar.classList.add("bg-red-500");
    }

    // update text
    if (timeLeft >= 0) {
      timerDisplay.textContent = `${timeLeft}s`;
    }

    // time over → auto next
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

// Move to next question
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion >= quizData.length) {
    // quiz finished
    clearInterval(timerInterval);
    showResults();
    return;
  }

  loadQuestion();
}

// Update score display
function updateScoreDisplay() {
  scoreDisplay.textContent = score;
}

// Show results and restart button
function showResults() {
  questionText.textContent = `Quiz Completed!`;
  optionDiv.innerHTML = `
                <div class="col-span-2 text-center py-8">
                    <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white mb-6">
                        <i class="fas fa-trophy text-4xl"></i>
                    </div>
                    <h3 class="text-3xl font-bold text-gray-800 mb-2">Your Score: ${score}/${
    quizData.length
  }</h3>
                    <p class="text-gray-600 mb-6">${
                      score >= quizData.length * 0.8
                        ? "Excellent! You are a quiz master!"
                        : score >= quizData.length * 0.6
                        ? "Good job! You know your stuff!"
                        : "Keep learning and try again!"
                    }</p>
                    <button id="restart-btn" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-2xl hover:from-purple-700 hover:to-indigo-700 transform transition-all duration-300 hover:scale-105">
                        <i class="fas fa-redo mr-2"></i>Play Again
                    </button>
                </div>
            `;

  progressBar.style.width = "0%";
  timerDisplay.textContent = "";

  // Add event listener to restart button
  document.getElementById("restart-btn").addEventListener("click", () => {
    startQuiz();
  });
  bottomText.innerText = "Thank from Nurul ❤️";
}
