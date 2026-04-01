/**
 * Project: English Janala
 * Task: Vocabulary Loading, Search, and Pronunciation
 * Note: Your original logic is kept intact to ensure API functionality.
 */

const createElements = (arr) => {
  // convert array items into html span elements
  const htmlElements = arr.map((el) => `<span class="btn btn-sm btn-outline btn-info">${el}</span>`);
  return htmlElements.join(" ");
};

function pronounceWord(word) {
  // create speech for word pronunciation
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US"; // Standard English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  // show or hide loading spinner based on status
  const spinner = document.getElementById("spinner");
  const wordContainer = document.getElementById("word-container");
  
  if (status === true) {
    spinner.classList.remove("hidden");
    wordContainer.classList.add("hidden");
  } else {
    wordContainer.classList.remove("hidden");
    spinner.classList.add("hidden");
  }
};

const loadLessons = () => {
  // fetch all lessons from API
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data))
    .catch(err => console.error("Error loading lessons:", err));
};

const removeActive = () => {
  // remove active class from all lesson buttons
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");
  });
};

const loadLevelWord = (id) => {
  // start loading spinner
  manageSpinner(true);

  // create API url using id
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  // fetch words for selected lesson
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive(); // remove all active class

      // highlight clicked button
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      if(clickBtn){
        clickBtn.classList.remove("btn-outline");
        clickBtn.classList.add("btn-primary");
      }

      displayLevelWord(data.data);
    });
};

const loadWordDetail = async (id) => {
  // fetch single word details
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  // show word details inside modal
  const detailsBox = document.getElementById("details-container");

  detailsBox.innerHTML = `
    <div class="space-y-3">
        <h2 class="text-2xl font-bold text-sky-600">
            ${word.word} 
            <span class="text-sm font-normal text-gray-500 block md:inline">
                (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})
            </span>
        </h2>
        <div class="divider"></div>
        <div>
            <h2 class="font-bold text-lg">Meaning</h2>
            <p class="text-gray-700">${word.meaning}</p>
        </div>
        <div>
            <h2 class="font-bold text-lg">Example</h2>
            <p class="italic text-gray-600 bg-gray-50 p-2 rounded">"${word.sentence}"</p>
        </div>
        <div>
            <h2 class="font-bold text-lg mb-2">Synonyms</h2>
            <div class="flex flex-wrap gap-2">${createElements(word.synonyms)}</div>
        </div>
    </div>
    `;

  // open modal
  document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");

  // clear previous words
  wordContainer.innerHTML = "";

  // if no word found
  if (words.length === 0) {
    wordContainer.innerHTML = `
    <div class="text-center col-span-full rounded-xl py-20 space-y-6 font-bangla">
        <img class="mx-auto w-24 opacity-50" src="./assets/alert-error.png" alt="No data"/>
        <p class="text-xl font-medium text-gray-400">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="font-bold text-3xl">নেক্সট Lesson এ যান</h2>
    </div>
    `;
    manageSpinner(false);
    return;
  }

  // loop through all words and create card for each word
  words.forEach((word) => {
    const card = document.createElement("div");
    card.classList = "bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center py-10 px-5 space-y-4 border border-gray-100";

    card.innerHTML = `
        <h2 class="font-bold text-2xl text-gray-800">${word.word || "শব্দ পাওয়া যায়নি"}</h2>
        <p class="text-sm text-gray-500 uppercase tracking-wide">Meaning / Pronunciation</p>
        <div class="text-xl font-medium font-bangla text-sky-600">
            "${word.meaning || "অর্থ পাওয়া যায়নি"} / ${word.pronunciation || "উচ্চারণ পাওয়া যায়নি"}"
        </div> 
        <div class="flex justify-center gap-4 mt-6">
          <button onclick="loadWordDetail(${word.id})" class="btn btn-circle btn-ghost bg-sky-50 text-sky-600 hover:bg-sky-100">
            <i class="fa-solid fa-circle-info text-xl"></i>
          </button>
          <button onclick="pronounceWord('${word.word}')" class="btn btn-circle btn-ghost bg-sky-50 text-sky-600 hover:bg-sky-100">
            <i class="fa-solid fa-volume-high text-xl"></i>
          </button>
        </div>
    `;
    wordContainer.append(card);
  });

  // stop spinner after loading
  manageSpinner(false);
};

const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn min-w-[140px]">
            <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
        </button>
    `;
    levelContainer.append(btnDiv);
  }
};

// load lessons when page loads
loadLessons();

// Search functionality
document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();

  if(!searchValue) return;

  manageSpinner(true);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLevelWord(filterWords);
    });
});