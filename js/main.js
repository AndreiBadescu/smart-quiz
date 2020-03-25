console.log("Loading...")

var question = document.getElementById("question");
var obj; // = questions[index]
var index; // the question's number
var max = questions.length;
var choice = ['A', 'B', 'C', 'D'];
var qPerm = [], aPerm = []; // random permutation of questions and answers
var game = document.getElementById("game");
var gameWindow = document.getElementsByTagName("body")[0];
var greyFilter = document.getElementById("overlay-filter");
var startMenu = document.getElementById("home_menu");
var startBtn = document.getElementById("start_btn");
var option = [
    document.getElementById("0"),
    document.getElementById("1"),
    document.getElementById("2"),
    document.getElementById("3")
];
var startSound = new Audio("audio/start.mp3");
var correctSound = new Audio("audio/correct.mp3");
var wrongSound = new Audio("audio/wrong.mp3");

startBtn.addEventListener("click", startGame);

function hide(btn) {
    if (!btn.classList.contains("hidden"))
        btn.classList.add("hidden");
}

function show(btn) {
    if (btn.classList.contains("hidden"))
        btn.classList.remove("hidden");
}

function removeEvents() {
    for (let i = 0; i < 4; ++i) {
        option[i].removeEventListener("click", checkAns);
    }
}

function addEvents() {
    for (let i = 0; i < 4; ++i) {
        option[i].addEventListener("click", checkAns);
    }
}

function checkAns(event) {
    removeEvents();

    if (aPerm[event.currentTarget.id] == obj.key) {
        // corect guess
        event.currentTarget.className = "correct";
        correctSound.play();

        function next(element) {
            element.className = "hover";
            playerGuess(++index);
        }
        setTimeout(next, 500, event.currentTarget);

    } 
    else {
        // wrong guess
        for (let i = 0; i < 4; ++i) {
            if (aPerm[i] == obj.key) {
                var ans = i;
                break;
            }
        }

        option[ans].className = "correct";
        event.currentTarget.className = "wrong";
        game.className = "vibration";
        wrongSound.play();

        function next(wrongChoice, correctChoice) {
            game.className = "";
            greyFilter.className = "show" // grayscale filter

            /// 0.5s when the greyFilter transition ends
            setTimeout(function() {
                gameWindow.className = "blur-filter"; // blur the screen
            }, 501); 

            showMenu(wrongChoice, correctChoice);
        }
        setTimeout(next, 800, event.currentTarget, option[ans]);
    }
}

function Transition() {
    game.style.transition = "";
    game.style.opacity = 0;

    setTimeout(function() {
        game.style.transition = "opacity 0.3s linear";
        game.style.opacity = 1;
    }, 200);
}

function genPerm(arr, len) {
    for (let i = 0; i < len; ++i) {
    	arr.push(i);
    }
    for (let i = len - 1; i >= 0; --i) {
        let rand = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }
}

function playerGuess(index) {
    Transition();

    if (index < max) {
        obj = questions[qPerm[index]];
        question.innerHTML = (1 + index) + ') ' + obj.question;

        aPerm = [];
        genPerm(aPerm, 4);

        for (let i = 0; i < 4; ++i) {
            option[i].innerHTML = choice[i] + '. ' + obj.answers[aPerm[i]];
            addEvents();
        }
    }
    else if (index == max) {
        alert("Congrats! You've finished the game!");
        resetGame();
    }
}

function showMenu(wrongChoice, correctChoice) {
    var retryMenu = document.getElementById('retry_menu');
    retryMenu.className = "centered";

    retryMenu.addEventListener("click", function () {
        wrongChoice.className = "hover";
        correctChoice.className = "hover";
        retryMenu.className = "hidden";
        resetGame();
    });
}

function resetGame() {
    gameWindow.className = "";
    greyFilter.className = "";
    Transition();
    hide(greyFilter);
    show(startMenu);
    hide(document.getElementById("question_block"));
    hide(document.getElementById("answers_block"));
}

function startGame() {
    hide(startMenu);
    show(document.getElementById("question_block"));
    show(document.getElementById("answers_block"));

    qPerm = [];
    genPerm(qPerm, max);

    startSound.play();
    playerGuess(index = 0);
}
