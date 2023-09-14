const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#nome')
const sFuncao = document.querySelector('#funçao')
const sInfo = document.querySelector('#info')
const sResponsavel = document.querySelector('#responsavel')
const btnSalvar = document.querySelector('#btnsalvar')
const barrapesquisar = document.getElementById('barrapesquisar')
const itemsPerPage = 5

let currentPage = 1
let itensFiltrados = []
let itens = []
let id

// //funçao pesquisa
function renderizarItensFiltrados() {
  tbody.innerHTML = ''
  itensFiltrados.forEach((item, index) => {
      insertItem(item, index)
  })
}
function filtrarItens(termoPesquisa) {
  termoPesquisa = termoPesquisa.toLowerCase();
  itensFiltrados = itens.filter(item => {
    return (
      item.nome.toLowerCase().includes(termoPesquisa) ||
      item.funçao.toLowerCase().includes(termoPesquisa) ||
      item.responsavel.toLowerCase().includes(termoPesquisa)
    );
  });
  renderizarItensFiltrados();
}
barrapesquisar.addEventListener('input', () => {
  const termoPesquisa = barrapesquisar.value
 filtrarItens(termoPesquisa)
})

//funçao CRUD
function openmodal(edit = false, index = 0) {
  modal.classList.add('active')
  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }
  if (edit) {
    sNome.value = itens[index].nome
    sFuncao.value = itens[index].funçao
    sInfo.value = itens[index].info
    sResponsavel.value = itens[index].responsavel
    id = index
  } else {
    sNome.value = ''
    sFuncao.value = ''
    sInfo.value = ''
    sResponsavel.value = ''
}}
function editItem(index) {
  openmodal(true, index)

}
function deleteItem(index) {{
    if (confirm('Realmente deseja apagar o Conteudo?')) {
        itens.splice(index, 1)
        setItensBD()
        loadItens()
}}}
function insertItem(item, index) {
  let tr = document.createElement('tr')
  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funçao}</td>
    <td>${item.info}</td>
    <td>${item.responsavel}</td>
    <td class="acao"><button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button></td>
    <td class="acao"><button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button></td>`
  tbody.appendChild(tr)
}
btnSalvar.onclick = e => {
  if (sNome.value == '' || sFuncao.value == '' || sInfo.value == '' || sResponsavel.value == '') {
    return
  }
  e.preventDefault()
  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].funçao = sFuncao.value
    itens[id].info = sInfo.value
    itens[id].responsavel = sResponsavel.value
  } else {
    itens.push({
      'nome': sNome.value,
      'funçao': sFuncao.value,
      'info': sInfo.value,
      'responsavel': sResponsavel.value
    })
  }
  setItensBD()
  modal.classList.remove('active')
  loadItens()
  id = undefined
};
function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  });
}
//funçao paginaçao
function updateTable() {
  const tableRows = document.querySelectorAll('#employeeList tbody tr')
  const totalPages = Math.ceil(tableRows.length / itemsPerPage)
  tableRows.forEach((row, index) => {
      if (index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage) {
          row.style.display = 'table-row'
      } else {
          row.style.display = 'none'
      }
  })
  const currentPageElement = document.getElementById('currentPage');
  if (currentPageElement) {
      currentPageElement.textContent = `Página ${currentPage} de ${totalPages}`;
  }
}
document.getElementById('previousPage').addEventListener('click', () => {
  if (currentPage > 1) {
      currentPage--
      updateTable()
  }
})
document.getElementById('nextPage').addEventListener('click', () => {
  const tableRows = document.querySelectorAll('#employeeList tbody tr')
  const totalPages = Math.ceil(tableRows.length / itemsPerPage)
  if (currentPage < totalPages) {
      currentPage++
      updateTable()
  }
})
function mostrarCampoSigiloso(){
  const campoInfoSigilosa = document.getElementById("campoInfoSigilosa");
  const qualInfoSigilosa = document.getElementById("qualInfoSigilosa");
  const simInfoSigilosa = document.getElementById("simInfoSigilosa");
  if (simInfoSigilosa.checked) {
      campoInfoSigilosa.style.display = "block";
      qualInfoSigilosa.required = true;
  }
}
function ocultarCampoSigiloso(){
  const campoInfoSigilosa = document.getElementById("campoInfoSigilosa");
  const qualInfoSigilosa = document.getElementById("qualInfoSigilosa");
  const naoInfoSigilosa = document.getElementById("naoInfoSigilosa");
  if (naoInfoSigilosa.checked) {
      campoInfoSigilosa.style.display = "none";
      qualInfoSigilosa.required = false;
      qualInfoSigilosa.value = "";
  }
}
updateTable()
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))
loadItens()