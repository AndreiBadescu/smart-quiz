console.log("Loading...")
/*
FBInstant.initializeAsync()
    .then(function() {
        var progress = 0;
        var interval = setInterval(function() {
            if (progress >= 100) {
                clearInterval(interval);
                FBInstant.startGameAsync().then(
                    function() {
                        console.log("Games has been started")
                    }
                )
            }
            FBInstant.setLoadingProgress(progress);
            progress += 10;
        }, 100)
    });
*/
// Miscellaneous
var question = document.getElementById("question");
var obj; // = questions[index]
var index; // the question's number
var max = questions.length;
var choice = ['A', 'B', 'C', 'D'];
var qPerm = [],
    aPerm = []; // random permutation of questions and answers
// WINDOWS + FILTERS
var game = document.getElementById("game");
var gameWindow = document.getElementsByTagName("body")[0];
var greyFilter = document.getElementById("overlay-filter");
var blurFilter = document.getElementById("blur-filter");
// MENUS
var startMenu = document.getElementById("home_menu");
var retryMenu = document.getElementById("retry_menu");
var settingsMenu = document.getElementById("settings_menu");
var creditsMenu = document.getElementById("credits_menu")
// BUTTONS
var startBtn = document.getElementById("start_btn");
var settingsBtn = document.getElementById("settings_btn");
var creditsBtn = document.getElementById("credits_btn");
var playagainBtn = document.getElementById("playagain_btn");
var homeBtn = document.getElementById("home_btn");
var option = [
    document.getElementById("0"),
    document.getElementById("1"),
    document.getElementById("2"),
    document.getElementById("3")
];
// SOUNDS
var startSound = new Audio("audio/start.mp3");
var correctSound = new Audio("audio/correct.mp3");
var wrongSound = new Audio("audio/wrong.mp3");
var clickMenuSound = new Audio("audio/clickMenu.mp3");

// MAKING BUTTONS WORK
startBtn.addEventListener("click", startGame);
settingsBtn.addEventListener("click", goToSettings);
creditsBtn.addEventListener("click", goToCredits);
addListeners(option); // answer buttons

// hidding an element
function hide(element) {
    if (!element.classList.contains("hidden"))
        element.classList.add("hidden");
}

// showing an element
function show(element) {
    if (element.classList.contains("hidden"))
        element.classList.remove("hidden");
}

function checkAns(event) {
    // checking the option the player chose
    if (aPerm[event.target.id] == obj.key) {
        // CORRECT GUESS
        event.target.className = "correct";
        correctSound.play();

        // next step: going to next question
        function next(element) {
            element.className = "hover";
            playerGuess(++index);
        }
        setTimeout(next, 500, event.target); //
    } else {
        // WRONG GUESS
        // looking for the correct answer
        for (let i = 0; i < 4; ++i) {
            if (aPerm[i] == obj.key) {
                var ans = i;
                break;
            }
        }
        // showing the correct answer and highlighting the wrong one
        option[ans].className = "correct";
        event.target.className = "wrong";

        // wrong answer effects
        wrongSound.play();
        game.className = "vibration";

        // next step: showing the Try Again Menu
        function next(wrongChoice, correctChoice) {
            game.className = "";
            showMenu(wrongChoice, correctChoice);
        }
        setTimeout(next, 800, event.target, option[ans]);
    }
}

// adding click event listener for every answer option available in the game
function addListeners(option) {
    for (let i = 0; i < option.length; ++i) {
        option[i].addEventListener("click", checkAns);
    }
}


// smooth trasnsition for questions (not for any filter)
function Transition() {
    game.style.transition = "";
    game.style.opacity = 0;

    setTimeout(function() {
        game.style.transition = "opacity 0.3s linear";
        game.style.opacity = 1;
    }, 200);
}

// here you can use all the filters
function useFilters() {
    greyFilter.className = "show" // apply grayscale filter
    blurFilter.className = "show" // apply blur(5px) filter
}

// here you can hide all the filters
function hideFilters() {
    greyFilter.className = "hidden" // hide grayscale filter
    blurFilter.className = "hidden" // hide blur(5px) filter
}

// generating random permutation of an array (questions/answers)
function genPerm(arr, len) {
    for (let i = 0; i < len; ++i) {
        arr.push(i);
    }
    for (let i = len - 1; i >= 0; --i) {
        let rand = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }
}

// processing the player's answer
function playerGuess(index) {
    Transition();

    if (index < max) {
        obj = questions[qPerm[index]];
        question.innerHTML = (1 + index) + ') ' + obj.question;

        aPerm = [];
        genPerm(aPerm, 4);

        for (let i = 0; i < 4; ++i) {
            option[i].innerHTML = choice[i] + '. ' + obj.answers[aPerm[i]];
            //addEvents();
        }
    } else if (index == max) {
        alert("Congrats! You've finished the game!");
        resetGame();
    }
}

function showMenu(wrongChoice, correctChoice) {
    useFilters();
    show(retryMenu);

    var toBeRemoved = function(event) {
        // removing the background colors
        wrongChoice.className = "hover";
        correctChoice.className = "hover";

        hide(retryMenu);

        playagainBtn.removeEventListener("click", toBeRemoved);
        homeBtn.removeEventListener("click", toBeRemoved);

        resetGame();
        if (event.target.id == "playagain_btn") {
            startGame();
        } else {
            clickMenuSound.play();
        }
    }

    playagainBtn.addEventListener("click", toBeRemoved);
    homeBtn.addEventListener("click", toBeRemoved);
}

function goToSettings() {
    clickMenuSound.play();
    hide(startMenu);
    show(settingsMenu);

    var goBackBtn = document.getElementsByClassName("go_back")[0];
    goBackBtn.addEventListener("click", function() {
        clickMenuSound.play();
        hide(settingsMenu);
        show(startMenu);
    });
}

function goToCredits() {
    clickMenuSound.play();
    hide(startMenu);
    show(creditsMenu);

    var goBackBtn = document.getElementsByClassName("go_back")[1];
    goBackBtn.addEventListener("click", function() {
        clickMenuSound.play();
        hide(creditsMenu);
        show(startMenu);
    });
}

function resetGame() {
    gameWindow.className = "";
    hideFilters(); //stops the filters from using the transition when going back to 0
    Transition();
    show(startMenu);
    hide(game);
}

function startGame() {
    show(greyFilter); // filter is now using the transiton property

    hide(startMenu);
    show(game);

    qPerm = [];
    genPerm(qPerm, max);

    startSound.play();
    playerGuess(index = 0);
}