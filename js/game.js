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
var score = document.getElementById("score");
var timeDisplayed = document.getElementById("time_left");
var timeLeft;
var stopWatch;
var question = document.getElementById("question");
var questionImg = document.getElementById("question_img");
var preloadedImg = new Image();
var obj; // = questions[index]
var index; // the question's number
var max = questions.length;
var numberOfOptions = 4;
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
var exitBtn = document.getElementById("exit_btn");
var option = [
    document.getElementById("0"),
    document.getElementById("1"),
    document.getElementById("2"),
    document.getElementById("3")
];
// SOUNDS
var startSound = new Audio("audio/start.mp3");
var clickMenuSound = new Audio("audio/clickMenu.mp3");
var correctSound = new Audio("audio/correct.mp3");
var wrongSound = new Audio("audio/wrong.mp3");
var clocktickSound = new Audio("audio/clocktick.mp3");
var currentPlayer;

// MAKING BUTTONS WORK
startBtn.addEventListener("click", startGame);
settingsBtn.addEventListener("click", goToSettings);
creditsBtn.addEventListener("click", goToCredits);
exitBtn.addEventListener("click", function(){
    playAudio(clickMenuSound);
    clearInterval(stopWatch);
    resetGame();
});

// PRELOADING AUDIOS
startSound.preload = "auto";
clickMenuSound.preload = "auto";
correctSound.preload = "auto";
wrongSound.preload = "auto";
clocktickSound.preload = "auto";

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

function playAudio(sound) {
    sound.currentTime = 0;
    sound.play();
}

function checkAns(event) {
    clearInterval(stopWatch);
    removeListeners(option); // block the other options
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
    } 
    else {
        // WRONG GUESS
        // looking for the correct answer
        for (let i = 0; i < numberOfOptions; ++i) {
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
            showMenu(wrongChoice, correctChoice);
        }
        setTimeout(next, 800, event.target, option[ans]);
    }
}

// removing click event listeners for every answer option available in the game
function removeListeners(option) {
    for (let i = 0; i < numberOfOptions; ++i) {
        option[i].removeEventListener("click", checkAns);
    }
}

// adding click event listeners for every answer option available in the game
function addListeners(option) {
    for (let i = 0; i < numberOfOptions; ++i) {
        option[i].addEventListener("click", checkAns);
    }
}

// smooth trasnsition for questions (not for any filter)
function Transition() {
    // making the game objects invsibile without a transition
    // a transition is needed only when changing the opacity from 0 to 1
    game.style.transition = "";
    game.style.opacity = 0;

    // changing the transition without a timeout won't apply
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
    // THE ARRAY MUST BE EMPTY !DOING THIS INSIDE THE FUNCTION WON'T WORK!
    for (let i = 0; i < len; ++i) {
        arr.push(i);
    }
    for (let i = len - 1; i >= 0; --i) {
        // Math.random() will generate a number between [0,1)
        // and this wil generate a number between [0, i+1)
        let rand = Math.floor(Math.random() * (i + 1));
        // swapping arr[i] and arr[rand]
        [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }
}

// making the buttons have the best possible padding
function dynamicPadding() {
    let minPadding = 100000,
        // 40% width of the viewport
        doc_40vw = 4 * document.documentElement.clientWidth / 10,
        // 90% width of the viewport
        doc_90vw = 9 * document.documentElement.clientWidth / 10;

    for (let i = 0; i < numberOfOptions; ++i) {
        // checking for small screens
        if (document.documentElement.clientWidth > 768)
            minPadding = Math.min(minPadding, doc_40vw - option[i].clientWidth);
        else
            minPadding = Math.min(minPadding, doc_90vw - option[i].clientWidth);
    }

    // padding must be divided in order to center the text near center 
    minPadding /= 2;

    // applying the styling for all the answer buttons
    for (let i = 0; i < numberOfOptions; ++i) {
        // in this case the media screen styling will apply
        if (document.documentElement.clientWidth > 768)
            option[i].style.width = "40vw"; // - margin
        else
            option[i].style.width = "90vw";
        // top, bottom and right padding
        option[i].style.padding = "1.4rem"
        // this is the dynamic padding
        option[i].style.paddingLeft = minPadding + "px";
    }
};

function countdown() {
    --timeLeft;
    timeDisplayed.innerHTML = timeLeft + "s";
    if (timeLeft == 0) {
        clearInterval(stopWatch);
        wrongSound.play();
        game.className = "vibration";
        showMenu();
    }
    else if (timeLeft > 0) 
    {
        if (timeLeft > 10)
            timeDisplayed.style.color = "#09d402"; // green
        else if (timeLeft > 5)
                timeDisplayed.style.color = "orange";
        else {
            clocktickSound.play();
            if (timeLeft > 3)
                timeDisplayed.style.color = "#ff4d4d"; // light red
            else
                timeDisplayed.style.color = "red";
        }
    }
}

// processing the player's answer
function playerGuess(index) {
    Transition();
    addListeners(option); // answer buttons
    // Checking if there are any questions left to display
    if (index < max) {
        // creating a stopwatch
        timeDisplayed.style.color = "#09d402";
        timeDisplayed.innerHTML = "15s";
        stopWatch = setInterval(countdown, 1000, timeLeft = 16);
        // updating the score
        score.innerHTML = "SCORE: " + index;
        // displaying the question
        obj = questions[qPerm[index]];
        question.innerHTML = obj.question;
        // changing the question image
        questionImg.src = preloadedImg.src;
        // preload next image
        if (index + 1 < max) {
            preloadedImg.src = "img/" + qPerm[index + 1] + ".jpg";
        }

        // generating a random permutation of the answer options
        aPerm = []; // emptying the array !inside the genPerm function won't work!
        genPerm(aPerm, numberOfOptions);

        // adding text (answers) to choice buttons
        for (let i = 0; i < numberOfOptions; ++i) {
            option[i].innerHTML = choice[i] + '. ' + obj.answers[aPerm[i]];
            // eliminating any width and padding to calculate 
            // the dynamic padding and center the text inside buttons
            option[i].style.width = "";
            option[i].style.padding = "0";
        }

        // adjusting the padding
        dynamicPadding();
    } 
    else if (index == max) {
        alert("Congrats! You've finished the game!");
        resetGame();
    }
}

function showMenu(wrongChoice, correctChoice) {
    clearInterval(stopWatch);
    useFilters();
    show(retryMenu);
    document.getElementById("final_score").innerHTML = index;

    var toBeRemoved = function(event) {
        // removing the background colors
        if (wrongChoice)
            wrongChoice.className = "hover";
        if (correctChoice)
            correctChoice.className = "hover";

        hide(retryMenu);

        playagainBtn.removeEventListener("click", toBeRemoved);
        homeBtn.removeEventListener("click", toBeRemoved);

        resetGame();
        if (event.target.id == "playagain_btn") {
            startGame();
        } 
        else {
            playAudio(clickMenuSound);
        }
    };

    playagainBtn.addEventListener("click", toBeRemoved);
    homeBtn.addEventListener("click", toBeRemoved);
}

function goToSettings() {
    playAudio(clickMenuSound);
    hide(startMenu);
    show(settingsMenu);

    var goBackBtn = document.getElementsByClassName("go_back_btn")[0];
    goBackBtn.addEventListener("click", function() {
        playAudio(clickMenuSound);
        hide(settingsMenu);
        show(startMenu);
    });
}

function goToCredits() {
    playAudio(clickMenuSound);
    hide(startMenu);
    show(creditsMenu);

    var goBackBtn = document.getElementsByClassName("go_back_btn")[1];
    goBackBtn.addEventListener("click", function() {
        playAudio(clickMenuSound);
        hide(creditsMenu);
        show(startMenu);
    });
}

function resetGame() {
    clearInterval(stopWatch);
    timeDisplayed.style.color = "black";
    gameWindow.className = "";
    game.className = "";
    hideFilters(); //stops the filters from using the transition when going back to 0
    Transition();
    show(startMenu);
    hide(game);
}

function startGame() {
    qPerm = [];
    genPerm(qPerm, max);
    preloadedImg.src = "img/" + qPerm[0] + ".jpg";; // loading the first image

    show(greyFilter); // filter is now using the transiton property
    hide(startMenu);
    show(game);
    playAudio(startSound);
    playerGuess(index = 0);
}
