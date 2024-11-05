fetch("words.json")
  .then((response) => response.json())
  .then((data) => {
    const vocabularyList = document.getElementById("vocabulary-list");

    data.forEach((word) => {
      const wordContainer = document.createElement("div");
      wordContainer.classList.add("word-container");

      const koreanWord = document.createElement("span");
      koreanWord.classList.add("korean-word");
      koreanWord.textContent = word.korean;

      const sinhalesesWord = document.createElement("span");
      sinhalesesWord.classList.add("sinhalese-word");
      sinhalesesWord.textContent = word.sinhalese;

      wordContainer.appendChild(koreanWord);
      wordContainer.appendChild(sinhalesesWord);
      vocabularyList.appendChild(wordContainer);
    });
  })
  .catch((error) => {
    console.error("Error fetching words:", error);
  });
