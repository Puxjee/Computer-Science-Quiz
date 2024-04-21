let questions = []

const apiUrl = "https://opentdb.com/api.php?amount=6&category=18&difficulty=easy&type=multiple"


const questionEl = document.getElementById('question')
const answerBtn = document.getElementById('answer-buttons')
const nextBtn = document.getElementById('next-btn')

let currentQuestionIndex = 0
let score = 0

async function startQuiz() {
    await fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        questions = data.results.map(result => ({
            question: result.question,
            answers: [
                {text: result.correct_answer, correct: true},
                ...result.incorrect_answers.map(
                    answer => ({text: answer, correct : false})
                )
            ]
        }))
    })
    .catch(error => { console.error("Error fetching API", error) } )
    currentQuestionIndex = 0
    score = 0
    nextBtn.innerHTML = "Next"
    showQuestion()
}

function showQuestion() {
    resetState()
    let currentQuestion = questions[currentQuestionIndex]
    let questionNo = currentQuestionIndex + 1
    questionEl.innerHTML = questionNo + ". " + currentQuestion.question
    
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        answerBtn.appendChild(button)
        if(answer.correct){
            button.dataset.correct = answer.correct
        }
        button.addEventListener("click", selectAnswer)
    })
}

function resetState() {
    nextBtn.style.display = "none"
    while (answerBtn.firstChild){
        answerBtn.removeChild(answerBtn.firstChild)
    }
}

function selectAnswer(e){
    const selectedBtn = e.target
    const isCorrect = selectedBtn.dataset.correct === "true"
    if (isCorrect) {
        score++
        selectedBtn.classList.add("correct")
    } else {
        selectedBtn.classList.add("incorrect")
    }
    Array.from(answerBtn.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct")
        }
        button.disabled = true
    })
    nextBtn.style.display = "block"
}

function handleNextButton() {
    currentQuestionIndex++
    if(currentQuestionIndex < questions.length){
        showQuestion()
    } else {
        showScore()
    }
}

function showScore(){
    resetState()
    questionEl.innerHTML = `You scored ${score} out of ${questions.length}!`
    nextBtn.innerHTML = "New Quiz"
    nextBtn.style.display = "block"
}

nextBtn.addEventListener("click", () => {   
    if(currentQuestionIndex < questions.length){
        handleNextButton()
    } else {
        startQuiz()
    }
})



startQuiz()