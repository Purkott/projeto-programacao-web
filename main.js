
async function login() {
  const email1 = document.getElementById('email').value;
  const pwd1 = document.getElementById('pwd').value;
  fetch('http://localhost/api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestID: "1",email: email1, pwd: pwd1 })
  }).then(response => response.json())
  .then(data => {
    if ( data.length == 0 ) {
      document.getElementById('errMsg').innerText = "Erro ao logar, por favor tente novamente";
    }
    else {
      sessionStorage.setItem("UID", data[0]["UID"]);
      window.location.href = "main.html";
    }
  });
}

function searchButton() {
  const searchInput = document.getElementById('searchTerm').value;
  const searchTerm = "%" + searchInput + "%";
  sessionStorage.setItem("Search", searchTerm);
  window.location.href = "search.html";
}

async function addBook(bID) {
  const userID = sessionStorage.getItem("UID");
  fetch('http://localhost/api.php', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ UID: userID, bookID: bID})
  }).then(response => response.json())
  .then(data => {
    if ( data.length == 0 ) {
      document.getElementById('errMsg').innerText = "Erro ao adicionar livro, tente novamente";
    }
    else {
      alert()
    }
  });
}

async function deleteBook(bID) {
  const userID = sessionStorage.getItem("UID");
  fetch('http://localhost/api.php', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ UID: userID, bookID: bID})
  }).then(response => response.json())
  .then(data => {
    if ( data.length == 0 ) {
      document.getElementById('errMsg').innerText = "Erro ao deletar livro, tente novamente";
    }
    else {
      location.reload();
    }
  });
}

async function loadBooks() {
  const userID = sessionStorage.getItem("UID");
  
  fetch('http://localhost/api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestID: "4", uid: userID})
  }).then(response => response.json())
  .then(data => {
    if ( data.length == 0 ) {
      document.getElementById('errMsg').innerText = "Erro ao carregar as estatisticas";
    }
    else {
      percentage = Module.cwrap('percentage', 'number', ['number'])
      document.getElementById('stats').innerText = `Total de livros: ${data[0][0]["COUNT(*)"]}
          Genero mais lido: ${data[1][0]["genre"]} (${percentage(data[1][0]["count_value"], data[0][0]["COUNT(*)"])}%)
          Autor mais lido: ${data[2][0]["author"]} (${percentage(data[2][0]["count_value"], data[0][0]["COUNT(*)"])}%)
          Livro mais recente: ${data[3][0]["title"]} (${data[3][0]["publishedYear"]})
          Livro mais antigo: ${data[4][0]["title"]} (${data[4][0]["publishedYear"]}) `;
    }
  });
  
  fetch('http://localhost/api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestID: "2", uid: userID})
  }).then(response => response.json())
  .then(data => {
    if ( data.length == 0 ) {
      document.getElementById('errMsg').innerText = "Erro ao carregar a lista";
    }
    else {
      const table = document.getElementById("listTable");
      for(var k in data) {
        let row = table.insertRow();
        let title = row.insertCell(0);
        title.innerHTML = data[k]['title'];
        let author = row.insertCell(1);
        author.innerHTML = data[k]['author'];
        let year = row.insertCell(2);
        year.innerHTML = data[k]['publishedYear'];
        let genre = row.insertCell(3);
        genre.innerHTML = data[k]['genre']
        let buttonCol = row.insertCell(4);
        buttonCol.innerHTML = 'remover';
        buttonCol.setAttribute("id", data[k]['bookID']);
        buttonCol.setAttribute("style","background-color:Tomato;")
        buttonCol.addEventListener('click', () => {
          deleteBook(buttonCol.id);
        });
      }
    }
  });
}

async function loadSearch() {
  const searchTerm = sessionStorage.getItem("Search");
  await fetch('http://localhost/api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestID: "3", search: searchTerm})
  }).then(response => response.json())
  .then(data => {
    if ( data.length == 0 ) {
      document.getElementById('errMsg').innerText = "Erro ao carregar a procura";
    }
    else {
      const table = document.getElementById("searchTable");
      for(var k in data) {
        let row = table.insertRow();
        let title = row.insertCell(0);
        title.innerHTML = data[k]['title'];
        let author = row.insertCell(1);
        author.innerHTML = data[k]['author'];
        let year = row.insertCell(2);
        year.innerHTML = data[k]['publishedYear'];
        let genre = row.insertCell(3);
        genre.innerHTML = data[k]['genre']
        let buttonCol = row.insertCell(4);
        buttonCol.innerHTML = 'adicionar';
        buttonCol.setAttribute("id", data[k]['bookID']);
        buttonCol.setAttribute("style","background-color:Green;")
        buttonCol.addEventListener('click', () => {
          addBook(buttonCol.id);
        });
      }
    }
  });
}

function returnListPage() {
  window.location.href = "main.html";
}

function handleLoad() {
  var curUrl = window.location.href;
  if (curUrl.includes("main.html")) {
    loadBooks();
  }
  if (curUrl.includes("search.html")) {
    loadSearch();
  }
} 

document.addEventListener('DOMContentLoaded', handleLoad);