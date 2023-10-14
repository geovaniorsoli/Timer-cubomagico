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
        notificacao("Cronômetro iniciado!");
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(updateTimerDisplay, 10);
        isTimerRunning = true;
        startStopButton.innerHTML = '<i class="fas fa-pause"></i>';
        startStopButton.classList.remove('btn-success'); 
        startStopButton.classList.add('btn-outline-warning');
    } else {
        notificacao("Cronômetro pausado");
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
        notificacao("Cronômetro reiniciado!");
    }
});

//salvar tempo tabela
function saveTime() {
    let savedTimes = JSON.parse(localStorage.getItem('savedTimes')) || [];
    savedTimes.push(elapsedTime);
    localStorage.setItem('savedTimes', JSON.stringify(savedTimes));
    updateSavedTimesTable(savedTimes);
    tituloTabela.innerText = `Tempo Salvo: ${formatarTempo(elapsedTime)}`;
    notificacao("Tempo salvo!");
    console.log("oi");
}

//paginação 
const ITEMS_PER_PAGE = 5; 
let currentPage = 1; 
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    // anterior
    const prevLi = document.createElement('li');
    prevLi.classList.add('page-item');
    if (currentPage === 1) prevLi.classList.add('disabled');

    const prevA = document.createElement('a');
    prevA.classList.add('page-link');
    prevA.href = '#';
    prevA.innerHTML = '<i class="fas fa-arrow-left"></i>';
    prevA.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            updateSavedTimesTable(JSON.parse(localStorage.getItem('savedTimes')) || []);
        }
    });

    prevLi.appendChild(prevA);
    paginationElement.appendChild(prevLi);

    // total
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (i === currentPage) li.classList.add('active');

        const a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = i;
        a.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage = i;
            updateSavedTimesTable(JSON.parse(localStorage.getItem('savedTimes')) || []);
        });

        li.appendChild(a);
        paginationElement.appendChild(li);
    }

    // prox
    const nextLi = document.createElement('li');
    nextLi.classList.add('page-item');
    if (currentPage === totalPages) nextLi.classList.add('disabled');

    const nextA = document.createElement('a');
    nextA.classList.add('page-link');
    nextA.href = '#';
    nextA.innerHTML = '<i class="fas fa-arrow-right"></i>';
    nextA.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            updateSavedTimesTable(JSON.parse(localStorage.getItem('savedTimes')) || []);
        }
    });

    nextLi.appendChild(nextA);
    paginationElement.appendChild(nextLi);
}


function updateSavedTimesTable(tempos) {
    const tbody = tabelaDeTempos.querySelector('tbody');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const temposToDisplay = tempos.slice(start, end);

    temposToDisplay.forEach((tempo, indice) => {
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${indice + 1 + start}</td>
            <td>${formatarTempo(tempo)}</td>
            <td><button class="btn btn-outline-danger btn-sm" onclick="deleteTime(${indice + start})"><i class="fas fa-times"></i></button></td>
        `;
        tbody.appendChild(novaLinha);
    });

    renderPagination(tempos.length);
}
//deletar tempo tabela

function deleteTime(index) {
    let savedTimes = JSON.parse(localStorage.getItem('savedTimes')) || [];
    savedTimes.splice(index, 1);
    localStorage.setItem('savedTimes', JSON.stringify(savedTimes));
    updateSavedTimesTable(savedTimes);
    notificacao("Tempo deletado!");
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
      notificacao("Tabela limpa!");
  });
});

//ordenar tabela
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
        notificacao("Tabela ordenada em ordem crescente!");
    } else if (ordenarSelect.value === 'desc') {
        savedTimes = mergeSort(savedTimes).reverse();
        notificacao("Tabela ordenada em ordem decrescente!");
    }
    updateSavedTimesTable(savedTimes);
  });
updateSavedTimesTable(JSON.parse(localStorage.getItem('savedTimes')) || []);

//notificações 

function notificacao(mensagem) {
    const notificacaoElement = document.getElementById('alerta');
    const notificacao = new bootstrap.Toast(notificacaoElement);
    notificacaoElement.querySelector('.toast-body').textContent = mensagem;

    let remainingTime = 20; 
    const timeInterval = 20;  

        if (remainingTime <= 0) {
            clearInterval(intervalId);
            notificacao.hide();
        }
    notificacao.show();
}


//tema

function toggleTheme() {
  const element = document.body;
  element.dataset.bsTheme = element.dataset.bsTheme === 'light' ? 'dark' : 'light';
}
