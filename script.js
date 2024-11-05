// Get references to the necessary HTML elements
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const resultElement = document.getElementById("result");
const scoreElement = document.getElementById("score");
const directionButton = document.getElementById("direction-button");

// Initialize the quiz data, score, and direction
let vocabularyData = [];
let correctCount = 0;
let wrongCount = 0;
let quizDirection = "korean-to-sinhalese"; // or "sinhalese-to-korean"

// Fetch the vocabulary data from the JSON file
fetch("words.json")
  .then((response) => response.json())
  .then((data) => {
    vocabularyData = data;
    loadQuiz();
  })
  .catch((error) => {
    console.error("Error fetching words:", error);
  });

// Function to load a new quiz question
function loadQuiz() {
  // Select a random word from the vocabulary data
  const randomIndex = Math.floor(Math.random() * vocabularyData.length);
  const currentWord = vocabularyData[randomIndex];

  // Prepare the question and answer options
  if (quizDirection === "korean-to-sinhalese") {
    questionElement.innerHTML = `<span class="korean-word fw-bold fs-1">${currentWord.korean}</span>`;
    questionElement.insertAdjacentHTML(
      "beforeend",
      `<br>Translate this Korean word:`
    );
  } else {
    questionElement.innerHTML = `<span class="sinhalese-word fw-bold fs-1">${currentWord.sinhalese}</span>`;
    questionElement.insertAdjacentHTML(
      "beforeend",
      `<br>Translate this Sinhalese word:`
    );
  }

  // Get the correct answer and 3 random incorrect answers
  const correctAnswer =
    quizDirection === "korean-to-sinhalese"
      ? currentWord.sinhalese
      : currentWord.korean;
  const incorrectAnswers = vocabularyData
    .filter(
      (word) =>
        word[
          quizDirection === "korean-to-sinhalese" ? "sinhalese" : "korean"
        ] !== correctAnswer
    )
    .map(
      (word) =>
        word[quizDirection === "korean-to-sinhalese" ? "sinhalese" : "korean"]
    )
    .slice(0, 3);

  const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
    () => Math.random() - 0.5
  );

  // Create the answer buttons
  answersElement.innerHTML = "";
  const answerButtonsContainer = document.createElement("div");
  answerButtonsContainer.classList.add("row", "row-cols-2", "g-2");

  allAnswers.forEach((answer) => {
    const answerBtn = document.createElement("div");
    answerBtn.classList.add("col");
    answerBtn.innerHTML = `<button class="btn btn-outline-primary w-100 mb-2">${answer}</button>`;
    answerBtn
      .querySelector("button")
      .addEventListener("click", () => checkAnswer(correctAnswer, answer));
    answerButtonsContainer.appendChild(answerBtn);
  });

  answersElement.appendChild(answerButtonsContainer);

  // Reset the result
  resultElement.textContent = "";

  // Update the score display
  scoreElement.textContent = `Score: ${correctCount} / ${
    correctCount + wrongCount
  } (W - ${wrongCount})`;

  // Update the direction button text
  directionButton.textContent =
    quizDirection === "korean-to-sinhalese" ? "සිං > 한" : "한 > සිං";
}

// Function to check the user's answer
function checkAnswer(correctAnswer, userAnswer) {
  const answerButtons = document.querySelectorAll("#answers button");

  if (userAnswer === correctAnswer) {
    correctCount++;
    answerButtons.forEach((btn) => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct-answer");
      } else {
        btn.classList.add("wrong-answer");
      }
    });
    resultElement.textContent = "Correct!";
    setTimeout(loadQuiz, 100);
  } else {
    wrongCount++;
    answerButtons.forEach((btn) => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct-answer");
      }
      btn.classList.add("wrong-answer");
    });
    resultElement.textContent = "Incorrect. Try again.";
    setTimeout(loadQuiz, 1000);
  }

  // Disable all answer buttons to prevent further submissions
  answerButtons.forEach((btn) => {
    btn.disabled = true;
  });
}

// Add event listener to the direction button
directionButton.addEventListener("click", () => {
  quizDirection =
    quizDirection === "korean-to-sinhalese"
      ? "sinhalese-to-korean"
      : "korean-to-sinhalese";
  loadQuiz();
});
