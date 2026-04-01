const loadLessons = () =>{
    fetch("https://openapi.programming-hero.com/api/levels/all") //promise of response
    .then(res=> res.json()) //promise of json data
    .then((json) => displayLesson(json.data))
}
const removeActive =()=> {
    const lessonButtons = document.querySelectorAll(".lesson-btn")
    // console.log(lessonButtons)
    lessonButtons.forEach((btn) => btn.classList.remove("active"))

}

const loadLevelWord = (id) => {

    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    // console.log(url);
    fetch(url)
    .then((res) => res.json())
    .then((data) =>{
        removeActive() // remove all active class
        const clickBtn = document.getElementById(`lesson-btn-${id}`)
        // console.log(clickBtn)
        clickBtn.classList.add('active') // add active class

        displayLevelWord(data.data)

    })
}

const displayLevelWord = (words)=>{
    // console.log(words)
    const wordContainer = document.getElementById('word-container');
    if (words.length == 0){
        wordContainer.innerHTML = 
        `
        <div class="text-center col-span-full space-y-6 rounded-xl py-10 font-bangla">
        <img class=mx-auto src="./assets/alert-error.png" alt="">
        <p class="text-xl text-gray-400 font-medium ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
      </div>
        `
    }

//     {
//     "id": 82,
//     "level": 1,
//     "word": "Car",
//     "meaning": "গাড়ি",
//     "pronunciation": "কার"
// }


    words.forEach((word)=>{
        console.log(word)
        const card = document.createElement('div')
        card.innerHTML = `
        
      <div class="bg-white rounded-xl shadow-sm text-center px-5 py-10 space-y-4">
        <h2 class="font-bold text-2xl">${word.word?word.word : 'no word found'}</h2>
        <p class="font-semibold">Meaning /Pronounciation</p>
        <div class="text-2xl font-bangla font-medium ">"${word.meaning ?word.meaning : "no found word meaning"} / ${word.pronunciation?word.pronunciation: "not found word pronunciation"}"</div>
        <div class="flex justify-between items-end">
          <button  class="btn  bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
          <button onclick="my_modal_5.showModal()" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
        </div>
      </div>`
        wordContainer.append(card);
        

    
    
    
})
}

const displayLesson = (lessons) => {
    // console.log(lessons)

    // 1.get the container & empty 
    const levelContainer = document.getElementById("level-container")
    levelContainer.innerHTML = ''

    // 2.get into every lessons 
    for(let lesson of lessons){
    //     3.create Element
         const btnDiv = document.createElement("div")
    btnDiv.innerHTML = `
        <button id='lesson-btn-${lesson.level_no}' onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn" ><i class="fa-solid fa-book-open"></i>lesson ${lesson.level_no}</button>
    `
    // 4.append into container
    levelContainer.append(btnDiv)
    } 
}
loadLessons();