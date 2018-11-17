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
            compareAnswers()
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
    location.hash = "finished"
    document.querySelector(".question-wrapper").style.display = "none";
    document.querySelector(".feedback-wrapper").style.display = "inline-block";
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

// compare questions

function listDrawnQuestions() {
    const drawnQuestions = [];

    order.map((questionOrder) => {
        questions.map((question) => {
            if (questionOrder === question.id) {
                drawnQuestions.push(question)
            }
        })
    })

    return drawnQuestions;
}

function listHits() {
    const hitList = []
    const answersUser = user.answers;
    const drawnQuestions = listDrawnQuestions();
    answersUser.map((marked, markedIndex) => {
        drawnQuestions.map((question, index) => {
            if (marked === question.rightAnswer && markedIndex === index) {
                hitList.push(question)
            }
        })
    });

    return hitList;
}

function listWrongQuestions() {
    const answersUser = user.answers;
    const wrongQuestions = []
    const drawnQuestions = listDrawnQuestions();

    answersUser.map((marked, markedIndex) => {
        drawnQuestions.map((question, index) => {
            if (markedIndex === index && marked !== question.rightAnswer) {
                wrongQuestions.push(question)
            }
        })
    });
    return wrongQuestions;
}

function listAmountHits() {
    const hitList = listHits();
    return hitList.length;
}

function calculateHitPercent() {
    const hitList = listHits();
    const percent = `${(hitList.length / questions.length) * 100}`;
    return percent;
}

function listSuccessfulQuestions() {
    const hitList = listHits();
}

function compareAnswers() {
    listWrongQuestions();
    const hits = listHits();
    const amountHits = listAmountHits();
    const percent = calculateHitPercent();
    listDrawnQuestions();

    const hitList = {
        amount: amountHits,
        percent: percent,
        answers: hits
    }
}


