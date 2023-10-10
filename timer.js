const startStopButton = document.getElementById('start-stop-button');
const saveTimeButton = document.getElementById('save-time-button');
const cubeTimer = document.getElementById('cube-timer');
const tituloTabela = document.getElementById('titulo-tabela');
const tabelaDeTempos = document.getElementById('tabela-de-tempos');

let startTime = 0;
let intervalId = null;
let isTimerRunning = false; 
let elapsedTime = 0;

//pegar a barra de espaço
document.body.addEventListener('keyup', function(e) {
  if (e.keyCode === 32) {
      toggleTimer(); 
  }
});

startStopButton.addEventListener('click', toggleTimer);
saveTimeButton.addEventListener('click', saveTime);

//trocar a cor do botao ao rodar o timer
function toggleTimer() {
  if (!isTimerRunning) {
      startTime = Date.now() - elapsedTime;
      intervalId = setInterval(updateTimerDisplay, 10);
      isTimerRunning = true;
      startStopButton.innerHTML = '<i class="fas fa-pause"></i>';
      startStopButton.classList.remove('btn-success'); 
      startStopButton.classList.add('btn-outline-warning');
  } else {
      clearInterval(intervalId);
      isTimerRunning = false;
      startStopButton.innerHTML = '<i class="fas fa-play"></i>';
      startStopButton.classList.remove('btn-outline-warning');   
      startStopButton.classList.add('btn-success');    
  }
}

function updateTimerDisplay() {
    elapsedTime = Date.now() - startTime;
    displayTime(elapsedTime);
}

function displayTime(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(2);
    cubeTimer.innerText = `${minutes}:${seconds}`;
}

//botao reset
document.getElementById('reset-button').addEventListener('click', () => {
    if (!isTimerRunning) {
        elapsedTime = 0;
        displayTime(0);
    }
});

//salvar tempo tabela
function saveTime() {
    let savedTimes = JSON.parse(localStorage.getItem('savedTimes')) || [];
    savedTimes.push(elapsedTime);
    localStorage.setItem('savedTimes', JSON.stringify(savedTimes));
    updateSavedTimesTable(savedTimes);
    tituloTabela.innerText = `Tempo Salvo: ${formatarTempo(elapsedTime)}`;
}

function updateSavedTimesTable(tempos) {
    const tbody = tabelaDeTempos.querySelector('tbody');
    tbody.innerHTML = '';
    tempos.forEach((tempo, indice) => {
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${indice + 1}</td>
            <td>${formatarTempo(tempo)}</td>
        `;
        tbody.appendChild(novaLinha);
    });
}

function formatarTempo(tempo) {
    const minutes = Math.floor(tempo / 60000);
    const seconds = ((tempo % 60000) / 1000).toFixed(2);
    return `${minutes}:${seconds}`;
}

//validacao apagar itens tabela 
document.getElementById('clear-table-button').addEventListener('click', () => {
  const confirmClearModal = new bootstrap.Modal(document.getElementById('confirmClearModal'));
  confirmClearModal.show();
  document.getElementById('confirmClearButton').addEventListener('click', () => {
      localStorage.removeItem('savedTimes');
      confirmClearModal.hide();
      updateSavedTimesTable([]);
  });
});


function mergeSort(array) {
  if (array.length <= 1) {
      return array;
  }

  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
          result.push(left[leftIndex]);
          leftIndex++;
      } else {
          result.push(right[rightIndex]);
          rightIndex++;
      }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

const ordenarSelect = document.getElementById('ordenar-tabela');

ordenarSelect.addEventListener('change', () => {
  let savedTimes = JSON.parse(localStorage.getItem('savedTimes')) || [];
  if (ordenarSelect.value === 'asc') {
      savedTimes = mergeSort(savedTimes);
  } else if (ordenarSelect.value === 'desc') {
      savedTimes = mergeSort(savedTimes).reverse();
  }
  updateSavedTimesTable(savedTimes);
});

updateSavedTimesTable(JSON.parse(localStorage.getItem('savedTimes')) || []);


//tema

function toggleTheme() {
  const element = document.body;
  element.dataset.bsTheme = element.dataset.bsTheme === 'light' ? 'dark' : 'light';
}
