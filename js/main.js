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
const nextArrow = document.querySelector("#narrow-next");
const prevArrow = document.querySelector("#narrow-back");

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
    console.log(quest)
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
                compareAnswers(user.answers, quest);
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
            prevArrow.classList.remove('disabled');
            nextArrow.classList.remove('disabled');
            return true;
        }
        else {
            prevArrow.classList.add('disabled');
            return false;
        }
    } else {
        compareAnswers(user.answers);
        nextArrow.classList.add('disabled');
        return false;
    }
}

function renderQuestion(quest) {
    const questNumber = document.querySelector("#current-question");
    questNumber.textContent = (quest + 1).toString().padStart('2', 0);
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
    if (forward && !isAnswered(currentQuestion)) nextArrow.classList.add('disabled');

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
    nextArrow.classList.remove('disabled');
}

function isAnswered(quest) {
    return user.answers[quest] != undefined;
}

function init() {
    // Show Question & Answers on screen
    renderQuestionText(currentQuestion);

    // Change question questAmount
    const questAmount = document.querySelector(".category-questnum > strong");
    questAmount.textContent = (questions.length).toString().padStart('2', 0);

    // Reset user answers' array
    user.answers.length = questions.length;
    user.answers.fill(undefined);

    // Disable navigation buttons
    nextArrow.classList.add('disabled');
    if (currentQuestion === 0) prevArrow.classList.add('disabled');

    // Add events to navigation buttons
    prevArrow.onclick = () => changeQuestion(false);
    nextArrow.onclick = (evt) => {

        // Only allow change question if one answer was selected
        if (isAnswered(currentQuestion)) {
            evt.target.classList.remove('disabled');
            changeQuestion(true);
        } else {
            evt.target.classList.add('disabled');
            alert("Você precisa selecionar uma alternativa antes de continuar");
        }
    }
}

init();

// compare questions

function compareAnswers(answers, quest) {  
    const questionsDrawn = [];

    order.map((questionOrder) => {
        questions.map((question) => {
            if (questionOrder === question.id) {
                questionsDrawn.push(question)
            }
        })
    })    

    const hitList = []
    answers.map((marked, markedIndex) => {
        questionsDrawn.map((question, index) => {
            if(marked === question.rightAnswer && markedIndex === index) {
                hitList.push(question)
            }
        })
    });

    listAmountHits(hitList);
    calculateHitPercent(hitList);
    listSuccessfulQuestions(hitList)
}

function listAmountHits(answers) {
    console.log('numero de acertos:', answers.length)
    return answers.length;
}

function calculateHitPercent(answers) {
    const percent = `${(answers.length / questions.length) * 100}%`;
    console.log('porcentagem: ',percent)
}

function listSuccessfulQuestions(hitList) {
    // coloca no html as questoes certas
    console.log('Questões certas',hitList)
}
