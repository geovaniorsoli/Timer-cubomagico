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

document.getElementById('reset-button').addEventListener('click', () => {
  if (!isRunning) {
    elapsedTime = 0;
    displayTime(0);
  }
});

// Tema escuro

function myFunction() {
  var element = document.body;
  element.dataset.bsTheme =
    element.dataset.bsTheme == 'light' ? 'dark' : 'light';
}

function stepFunction(event) {
  debugger;
  var element = document.getElementsByClassName('collapse');
  for (var i = 0; i < element.length; i++) {
    if (element[i] !== event.target.ariaControls) {
      element[i].classList.remove('show');
    }
  }
}

const saveTimeButton = document.getElementById('save-time-button');
saveTimeButton.addEventListener('click', () => {
  const tempoSalvo = elapsedTime;
  let savedTimes = JSON.parse(localStorage.getItem('savedTimes')) || [];
  savedTimes.push(tempoSalvo);

  localStorage.setItem('savedTimes', JSON.stringify(savedTimes));
  atualizarTabelaDeTempos(savedTimes);
});

function atualizarTabelaDeTempos(savedTimes) {
  const tabela = document.getElementById('tabela-de-tempos');
  const tbody = tabela.querySelector('tbody');

  tbody.innerHTML = '';

  savedTimes.forEach((tempo, indice) => {
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
      <td>${indice + 1}</td>
      <td>${formatarTempo(tempo)}</td>
    `;
    tbody.appendChild(novaLinha);
  });

 
  const tituloTabela = document.getElementById('titulo-tabela');
  tituloTabela.innerText = 'Tempos Salvos';

  tabela.style.display = 'table';
}


function formatarTempo(tempo) {
  const minutos = Math.floor(tempo / 60000);
  const segundos = ((tempo % 60000) / 1000).toFixed(2);
  return `${minutos}:${segundos}`;
}
const clearTableButton = document.getElementById('clear-table-button');

clearTableButton.addEventListener('click', () => {
    const tbody = document.getElementById('tabela-de-tempos').querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    localStorage.removeItem('savedTimes');
});

saveTimeButton.addEventListener('click', () => {
  const tempoSalvo = elapsedTime;

  const tituloTabela = document.getElementById('titulo-tabela');
  tituloTabela.innerText = `Tempo Salvo: ${formatarTempo(tempoSalvo)}`;
});

document.addEventListener('DOMContentLoaded', () => {
  const tabelaDeTempos = document.getElementById('tabela-de-tempos');
  const tbody = tabelaDeTempos.querySelector('tbody');

  const temposSalvos = JSON.parse(localStorage.getItem('savedTimes')) || [];

  temposSalvos.forEach((tempo, indice) => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
          <td>${indice + 1}</td>
          <td>${formatarTempo(tempo)}</td>
      `;
      tbody.appendChild(newRow);
  });

  tabelaDeTempos.style.display = 'table';
});

const ordenarSelect = document.getElementById('ordenar-tabela');
const tabelaDeTempos = document.getElementById('tabela-de-tempos');
const temposSalvos = JSON.parse(localStorage.getItem('savedTimes')) || [];

ordenarSelect.addEventListener('change', () => {
  const ordem = ordenarSelect.value;
  const temposOrdenados = [...temposSalvos];

  if (ordem === 'asc') {
    temposOrdenados.sort((a, b) => a - b); 
  } else if (ordem === 'desc') {
    temposOrdenados.sort((a, b) => b - a); 
  }

  atualizarTabelaDeTempos(temposOrdenados);
});

function atualizarTabelaDeTempos(tempos) {
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

document.getElementById('clear-table-button').addEventListener('click', () => {

  const confirmClearModal = new bootstrap.Modal(document.getElementById('confirmClearModal'));
  confirmClearModal.show();
  document.getElementById('confirmClearButton').addEventListener('click', () => {
      const tabela = document.getElementById('tabela-de-tempos');
    
      localStorage.removeItem('savedTimes');
      confirmClearModal.hide();
  });
});

