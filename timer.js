let timer;
let startTime;
let isRunning = false;
let isSpacePressed = false;
let elapsedTime = 0;

const cubeTimer = document.getElementById('cube-timer');
const startStopButton = document.getElementById('start-stop-button');

startStopButton.addEventListener('click', () => {
  if (!isRunning) {
    if (isSpacePressed) {
      elapsedTime = 0; 
    }
    startTime = Date.now() - elapsedTime;
    timer = setInterval(updateTimer, 10);
    isRunning = true;
    startStopButton.innerText = 'Pausar';
  } else {
    clearInterval(timer);
    isRunning = false;
    startStopButton.innerText = 'Iniciar';
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === ' ' && !isRunning) {
    isSpacePressed = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === ' ' && isSpacePressed) {
    if (!isRunning) {
      elapsedTime = 0; 
      startTime = Date.now();
      displayTime(0);
    } else {
      clearInterval(timer);
      isRunning = false;
      startStopButton.innerText = 'Iniciar';
    }
    isSpacePressed = false;
  }
});

function updateTimer() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;
  displayTime(elapsedTime);
}

function displayTime(time) {
  const minutes = Math.floor(time / 60000);
  const seconds = ((time % 60000) / 1000).toFixed(2);
  cubeTimer.innerText = `${minutes}:${seconds}`;
}


//tema escuro

function myFunction() {
    var element = document.body;
    element.dataset.bsTheme =
      element.dataset.bsTheme == "light" ? "dark" : "light";
  }
  function stepFunction(event) {
    debugger;
    var element = document.getElementsByClassName("collapse");
    for (var i = 0; i < element.length; i++) {
      if (element[i] !== event.target.ariaControls) {
        element[i].classList.remove("show");
      }
    }
  }