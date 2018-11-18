const { search } = window.location;
const urlParams = new URLSearchParams(search);
const category = urlParams.get('category');

let currentQuestion = +location.hash.slice(1) | 0;
const questions = getQuestions(category);
const order = sortArrIndex(questions);

const questionElements = {
    text: document.querySelector(".quiz-question h2"),
    alternatives: document.querySelectorAll('.question-option')
}
const nextArrow = document.querySelectorAll(".narrow-next");
const prevArrow = document.querySelectorAll(".narrow-back");

const user = {
    answers: []
}

function sortArrIndex(array) {
    const lenght = array.length;
    let newArr = [];
    while (newArr.length < array.length) {
        let index = Math.floor(Math.random() * lenght);
        if (!newArr.includes(index)) newArr.push(index);
    }
    return newArr;
}

function getQuestions(category) {
    switch (category) {
        case 'movies':
            return moviesCategory;
        case 'series':
            return seriesCategory;
        case 'animes':
            return animesCategory;
        case 'musics':
            return musicsCategory;
    }
}

function redirectToInitialPage() {
    alert('Para responder as questões, é preciso escolher uma categoria!');
    window.location.replace("./index.htm");
}

if (search === "") {
    window.onload = redirectToInitialPage;
} else {
    const contentMain = document.getElementById('content-main');
    contentMain.setAttribute('class', `${category}`);
    setCategoryContent(category);
}
/* =================================== */

function addStarLevel(level) {
    for (let i = 1; i <= level; i++) {
        const img = document.createElement("img");
        img.src = "./img/icons/star-level.svg";
        const src = document.getElementById('level-stars');
        src.appendChild(img);
    }
}
function setCategoryContent() {
    let level = 0;
    switch (category) {
        case "movies":
            level = 1;
            document.getElementById("title").innerHTML = "Filmes";
            document.getElementById("ic-category").src = "./img/icons/quiz-movie.svg";
            document.getElementById("level-text").innerHTML = "Fácil"
            addStarLevel(level);
            break;
        case "series":
            level = 2;
            document.getElementById("title").innerHTML = "Séries";
            document.getElementById("ic-category").src = "./img/icons/quiz-serie.svg";
            document.getElementById("level-text").innerHTML = "Médio"
            addStarLevel(level);
            break;
        case "animes":
            level = 2;
            document.getElementById("title").innerHTML = "Animes";
            document.getElementById("ic-category").src = "./img/icons/quiz-anime.svg";
            document.getElementById("level-text").innerHTML = "Médio"
            addStarLevel(level);
            break;
        case "musics":
            level = 3;
            document.getElementById("title").innerHTML = "Músicas";
            document.getElementById("ic-category").src = "./img/icons/quiz-music.svg";
            document.getElementById("level-text").innerHTML = "Difícil"
            addStarLevel(level);
            break;
        default:
            category;
    }
}

function renderQuestionText(index) {
    const quest = questions[order[index]];
    questionElements.text.textContent = quest.question;
    questionElements.alternatives.forEach((alt, i) => {
        alt.children[1].textContent = quest.answers[i];
        alt.onclick = () => {
            questionElements.alternatives.forEach((alt) => {
                alt.classList.remove('active');
            })
            if (user.answers[index] === i) {
                registAnswer(undefined)
            } else {
                registAnswer(i);
                alt.classList.add('active');
            }
        }
    })
}

function incrementQuestionCounter(times) {
    let nextQuestion = currentQuestion;
    if ((nextQuestion += times) < questions.length) {
        if ((nextQuestion += times) >= -1) {
            currentQuestion += times;
            prevArrow.forEach(item => item.classList.remove('disabled'));
            nextArrow.forEach(item => item.classList.remove('disabled'));
            return true;
        }
        else {
            prevArrow.forEach(item => item.classList.add('disabled'));
            return false;
        }
    } else {
        nextArrow.forEach(item => item.classList.add('disabled'));
        const finish = confirm("Deseja finalizar o quiz e ver suas respostas?")
        if (finish) {
            seeRightAnswers();
        }
        return false;
    }
}

function renderQuestion(quest) {
    const questNumber = document.querySelectorAll(".current-question");
    questNumber.forEach(item => item.textContent = (quest + 1).toString().padStart('2', 0))
    location.hash = `#${quest.toString().padStart('2', 0)}`;
    renderQuestionText(quest);
    if (isAnswered(quest)) {
        questionElements.alternatives[user.answers[quest]]
            .classList.add('active');
    }
}

function changeQuestion(forward) {
    // Increase or Decrease currentQuestion
    // If not succeed, stop the function
    if (!incrementQuestionCounter(forward ? +1 : -1)) return;

    // Generate an array with classes in order to be added
    let animationClass;
    if (forward) animationClass = ["changeOut", "changeIn"];
    else animationClass = ["changeIn", "changeOut"];

    // Remove all "active" class from alternatives
    questionElements.alternatives.forEach((alt) => {
        alt.classList.remove('active');
    })

    // Disable next navigation button
    if (forward && !isAnswered(currentQuestion)) nextArrow.forEach(item => item.classList.add('disabled'));

    // Animate question area & change question
    let questionArea = document.querySelector(".quiz-question");
    if (!forward) questionArea.classList.add("changeReverse");
    questionArea.classList.add(animationClass[0]);
    setTimeout(() => {
        questionArea.classList.remove(animationClass[0]);
        questionArea.classList.add(animationClass[1]);
        renderQuestion(currentQuestion);
        setTimeout(() => {
            questionArea.classList.remove(animationClass[1]);
            if (!forward) questionArea.classList.remove("changeReverse");
        }, 250);
    }, 250)
}

function registAnswer(index) {
    user.answers[currentQuestion] = index;
    nextArrow.forEach(item => item.classList.remove('disabled'));
}

function isAnswered(quest) {
    return user.answers[quest] != undefined;
}

function seeRightAnswers() {
    const hitList = listHits();
    const hitsAmout = listAmountHits(hitList);
    const percent = calculateHitPercent(hitsAmout);

    const cardWrapper = document.querySelector(".questions-answers > article");
    const emoticonFeedback = document.querySelector(".emotion-feedback");
    const feedbackData = document.querySelector(".hits-feedback");

    location.hash = "finished"
    document.querySelector(".question-wrapper").style.display = "none";
    document.querySelector(".feedback-wrapper").style.display = "inline-block";
    
    hitList.forEach((item, i) => {
        cardWrapper.appendChild(renderUserFeedbackCard(i, item))
    })
    
    if(percent === 100){
        feedbackData.classList.add("excellent");
        emoticonFeedback.children[4].className = "emotion-active";
        emoticonFeedback.children[4].setAttribute("src", "./img/icons/feedback-emoticons/100.png");
    } else if (percent >= 75){
        feedbackData.classList.add("very-good");
        emoticonFeedback.children[3].className = "emotion-active";
        emoticonFeedback.children[3].setAttribute("src", "./img/icons/feedback-emoticons/75.png");
    } else if (percent >= 50){
        feedbackData.classList.add("good");
        emoticonFeedback.children[2].className = "emotion-active";
        emoticonFeedback.children[2].setAttribute("src", "./img/icons/feedback-emoticons/50.png");
    } else if (percent >= 25){
        feedbackData.classList.add("bad");
        emoticonFeedback.children[1].className = "emotion-active";
        emoticonFeedback.children[1].setAttribute("src", "./img/icons/feedback-emoticons/25.png");
    } else {
        feedbackData.classList.add("very-bad");
        emoticonFeedback.children[0].className = "emotion-active";
        emoticonFeedback.children[0].setAttribute("src", "./img/icons/feedback-emoticons/0.png");
    }
    feedbackData.children[0].innerHTML = Math.ceil(percent) + "%";
    feedbackData.children[2].innerHTML = `${hitsAmout} de ${questions.length} questões`;
}

function init() {
    // Show Question & Answers on screen
    renderQuestionText(currentQuestion);

    // Change question questAmount
    const questAmount = document.querySelectorAll(".category-questnum > strong");
    questAmount.forEach(item => item.textContent = (questions.length).toString().padStart('2', 0));

    // Change current question indicator
    const questNumber = document.querySelectorAll(".current-question");
    questNumber.forEach(item => item.textContent = (currentQuestion + 1).toString().padStart('2', 0))

    // Reset user answers' array
    user.answers.length = questions.length;
    user.answers.fill(undefined);

    // Disable navigation buttons
    nextArrow.forEach(item => item.classList.add('disabled'));
    if (currentQuestion === 0) prevArrow.forEach(item => item.classList.add('disabled'));

    // Add events to navigation buttons
    prevArrow.forEach(item => item.onclick = () => changeQuestion(false));
    nextArrow.forEach(item => item.onclick = (evt) => {

        // Only allow change question if one answer was selected
        if (isAnswered(currentQuestion)) {
            evt.target.classList.remove('disabled');
            changeQuestion(true);
        } else {
            evt.target.classList.add('disabled');
            alert("Você precisa selecionar uma alternativa antes de continuar");
        }
    });
}

init();

class QuestionResponse {
    constructor(text, answers, userAnswer, rightAnswer){
        this.question = text;
        this.userAnswer = {
            index: userAnswer,
            text: answers[userAnswer]
        };

        if(rightAnswer !== userAnswer){
            this.rightAnswer = {
                index: rightAnswer,
                text: answers[rightAnswer]
            }
        }
    }
}

// compare questions
function listHits(){
    let hitList = [];
    
    hitList = order.map((item, index) => {
        const userAnswer = user.answers[index];
        const { question, answers, rightAnswer } = questions.find(quest => quest.id === item);

        return new QuestionResponse(question, answers, userAnswer, rightAnswer);
    })
    return hitList;
}

function listAmountHits(quizFeedback) {
    const listHits = quizFeedback;
    const amountHits = listHits.reduce((total, item) => {
        return !item.rightAnswer ? total + 1 : total + 0;
    }, 0);
    return amountHits;
}

function calculateHitPercent(hitsAmount) {
    const amoutQuestions = questions.length;
    const percent = hitsAmount / amoutQuestions * 100;
    return percent;
}

function getLetter(index){
    switch (index){
        case 0:
            return "a"
        case 1:
            return "b"
        case 2:
            return "c"
        case 3:
            return "d"
        default:
            return ""
    }
}

function renderUserFeedbackCard(index, item){
    let feedbackContent;
    let userFeedbackClass;
    
    const card = document.createElement("div");
    const userHint = document.createElement("div");
    const questionText = document.createElement("p");
    const questionNumber = (index + 1).toString().padStart(2, "0");
    const { question:text, userAnswer, rightAnswer } = item;
    
    card.setAttribute("class", "question-feedback");
    userHint.setAttribute("class", "user-answer-wrapper");
    questionText.innerHTML = `<span>${questionNumber}.</span> ${text}`;


    if(rightAnswer){
        userFeedbackClass = "user-wrong-answer";
        feedbackContent = (
        `<div class="wrong-answer">
            <span>Alternativa Correta:</span>
            <div>
                <span class="option-letter">${getLetter(rightAnswer.index)}</span>
                <span>${rightAnswer.text}</span>
            </div>
        </div>`)
    } 
    else {
        userFeedbackClass = "user-answer";
        feedbackContent = (
        `<div class="right-answer">
            <img src="./img/icons/right-answer.svg" />
            <div>
                <span>Parabéns!</span>
                <p>Você acertou essa questão!</p>
            </div>
        </div>`);
    }

    userHint.innerHTML = (
    `<div>
        <div class="user-answer-feedback">
            <div class="${userFeedbackClass}">
                <span class="option-letter">${getLetter(userAnswer.index)}</span>
                <span>${userAnswer.text}</span>
            </div>
            <div class="user-answer-content">
                ${feedbackContent}
            </div>
        </div>
    </div>`);

    card.appendChild(questionText);
    card.appendChild(userHint);
    return card;
}