

let SelectedLeitor = null
function buildUsersCard(id, nome, contato, turma, emprestimos, max_emprestimos) {
    let newid = parseInt(id)
    return `
    <div class="card shadow-sm m-2">
    <div class="card-body">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-6">
                    <h5 class="fw-bold">${nome}</h5>
                    <p class="mb-1">Contato:  ${contato}</p>
                    <p class="mb-1">Empréstimos: ${emprestimos}/${max_emprestimos}</p><span class="badge bg-primary ms-0 m-1">${turma}</span>
                </div>
                <div class="col d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-sm-end align-items-sm-center justify-content-md-end align-items-md-center justify-content-lg-end align-items-lg-center justify-content-xl-end align-items-xl-center">
                    <div class="dropdown"><button class="btn btn-primary dropdown-toggle mt-1" aria-expanded="false" data-bs-toggle="dropdown" type="button"><svg class="mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="-32 0 512 512" width="1em" height="1em" fill="currentColor" style="margin-right: 6px;font-size: 16px;">
                                <path d="M201 10.3c14.3-7.8 31.6-7.8 46 0L422.3 106c5.1 2.8 8.3 8.2 8.3 14s-3.2 11.2-8.3 14L231.7 238c-4.8 2.6-10.5 2.6-15.3 0L25.7 134c-5.1-2.8-8.3-8.2-8.3-14s3.2-11.2 8.3-14L201 10.3zM23.7 170l176 96c5.1 2.8 8.3 8.2 8.3 14V496c0 5.6-3 10.9-7.8 13.8s-10.9 3-15.8 .3L25 423.1C9.6 414.7 0 398.6 0 381V184c0-5.6 3-10.9 7.8-13.8s10.9-3 15.8-.3zm400.7 0c5-2.7 11-2.6 15.8 .3s7.8 8.1 7.8 13.8V381c0 17.6-9.6 33.7-25 42.1L263.7 510c-5 2.7-11 2.6-15.8-.3s-7.8-8.1-7.8-13.8V280c0-5.9 3.2-11.2 8.3-14l176-96z"></path>
                            </svg>Ações</button>
                        <div class="dropdown-menu"><a class="dropdown-item" href="/leitores?modal=${newid}">Editar</a><a class="dropdown-item" href="/leitores?emprestimo=${newid}" >Emprestimos</a><a class="dropdown-item" href="#" onclick="removeUser(${id})">Deletar</a></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
}
let userMaxEmprestimos;
fetch('http://localhost:5000/api/config')
    .then(res => res.json())
    .then(data => {
        userMaxEmprestimos = data.max_per_user;
    })
    .catch(error => console.error('Error:', error));
let UsersList = document.getElementById('users-list-cards')
//o termo está sendo passado via query string
let searchTerm = new URLSearchParams(window.location.search).get('search') || ''
fetch('http://localhost:5000/api/users')
    .then(res => res.json())
    .then(data => {
        //console.log(data)
        if (data.length == 0) {
            //return alertError('Não há livros cadastrados!')
        }
        if (searchTerm) {
            searchTerm = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            data = data.filter(user => 
                user.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm) ||
                user.turma.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm) ||
                user.contato.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm)
            );
            if (data.length == 0) {
                return alertError('Não consegui achar nem um Leitor em sua pesquisa!')
            }
        }
        // Ordena os livros por ordem alfabética
        data.sort((a, b) => a.nome.localeCompare(b.nome));
        data.forEach(user => {
            UsersList.innerHTML += buildUsersCard(user.id, user.nome, user.contato, user.turma, user.emprestimos, userMaxEmprestimos)
        })
    })


function reloadUsers() {
    UsersList.innerHTML = ''
    fetch('http://localhost:5000/api/users')
        .then(res => res.json())
        .then(data => {
            //console.log(data)
            if (data.length == 0) {
                return alertError('Não há livros cadastrados!')
            }
            if (searchTerm) {
                searchTerm = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                data = data.filter(user => 
                    user.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm) ||
                    user.turma.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm) ||
                    user.contato.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm)
                );
                if (data.length == 0) {
                    return alertError('Não consegui achar nem um Leitor em sua pesquisa!')
                }
            }
            // Ordena os livros por ordem alfabética
            data.sort((a, b) => a.nome.localeCompare(b.nome));
            data.forEach(user => {
                UsersList.innerHTML += buildUsersCard(user.id, user.nome, user.contato, user.turma, user.emprestimos, userMaxEmprestimos)
            })
        })
}

const modalUsers = document.getElementById('Modal_Leitor')
//o modal deve abrir caso o termo modal esteja na query string
if (new URLSearchParams(window.location.search).get('modal')) {
    valor = new URLSearchParams(window.location.search).get('modal')
    if (valor == 'new') {
        setModalType('new')
        let myModal = new bootstrap.Modal(modalUsers)
        myModal.show()
    } else {
        fetch(`http://localhost:5000/api/users/${valor}`)
            .then(response => {
                if (response.status == 404) {
                    alertError('Leitor não encontrado!')
                    return
                }
                return response.json();
            })
            .then(data => {
                    setModalType('edit')
                    SelectedLeitor = data.id
                    document.getElementById("leitor-nome").value = data.nome
                    document.getElementById("leitor-contato").value = data.contato
                    $('#leitor-turma').selectpicker('val', data.turma); 
                    let myModal = new bootstrap.Modal(modalUsers)
                    myModal.show()
            })
        }
    
    
}
const modal_emp = document.getElementById('Modal_Emprestimos_leitor')
if (new URLSearchParams(window.location.search).get('emprestimo')) {
    valor = new URLSearchParams(window.location.search).get('emprestimo')
    fetch(`http://localhost:5000/api/users/${valor}`)
        .then(response => {
            if (response.status == 404) {
                alertError('Leitor não encontrado!')
                return
            }
            return response.json();
        })
        .then(data => {
            if (data.livros_emprestados_ids.length == 0) {
                alertError('Leitor não tem emprestimos!')
                return
            } else {
let idsLivros = data.livros_emprestados_ids.split(',')
let nomesLivros = data.livros_emprestados_nomes.split(',')

let emprestimos = []
for (let i = 0; i < idsLivros.length; i++) {
    emprestimos.push({
        id: idsLivros[i],
        livro: nomesLivros[i]
    })
}

let myModal = new bootstrap.Modal(modal_emp)
myModal.show()
let cardEmp = document.getElementById('card-todos-os-emprestimos')
let cardsHTML = ''
emprestimos.forEach(emp => {
    cardsHTML += genCardsEmp(emp.livro, emp.id)
})
cardEmp.innerHTML = cardsHTML}
        })
}

function setModalType(type) {
    if (type == 'new') {
        let modal_btn_save_leitor = document.getElementById('modal_btn_save_leitor')
        let modal_btn_edit_leitor = document.getElementById('modal_btn_edit_leitor')
        modal_btn_save_leitor.classList.remove('d-none')
        modal_btn_save_leitor.classList.add('d-flex')
        //remova a classe d-flex e adiciona a d-none
        modal_btn_edit_leitor.classList.remove('d-flex')
        modal_btn_edit_leitor.classList.add('d-none')
    } else {
        let modal_btn_save_leitor = document.getElementById('modal_btn_save_leitor')
        let modal_btn_edit_leitor = document.getElementById('modal_btn_edit_leitor')
        modal_btn_save_leitor.classList.remove('d-flex')
        modal_btn_save_leitor.classList.add('d-none')
        //remova a classe d-none e adiciona a d-flex
        modal_btn_edit_leitor.classList.remove('d-none')
        modal_btn_edit_leitor.classList.add('d-flex')
    }
}

function addUser() {
    let data = getModalData()
    if (data == undefined) {
        return
    } else {
        fetch('http://localhost:5000/api/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            res.status == 200 ? alertSucess('Leitor adicionado com sucesso!') : alertError('Erro ao adicionar Leitor!')
            reloadUsers()
            //feche o modal
            $('#Modal_Leitor').modal('hide');
        }).catch(err => {
            alertError('Erro ao adicionar Leitor!')
        })
    
    }


}

function editUser() {
    let data = getModalData()
    if (data == undefined) {
        return
    } else {
        fetch(`http://localhost:5000/api/users/edit/${SelectedLeitor}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            res.status == 200 ? alertSucess('Leitor atualizado com sucesso!') : alertError('Erro ao atualizar Leitor!')
            reloadUsers()
            //feche o modal
            $('#Modal_Leitor').modal('hide');
        }).catch(err => {
            console.log(err)
            alertError('Erro ao atualizar Leitor!')
        })
    
    }
}

function getModalData() {
    let nome = document.getElementById("leitor-nome").value
    if (nome.length < 1) {
        alertError('Nome do Leitor não pode ser vazio!')
        return
    }
    let contato = document.getElementById("leitor-contato").value
    if (contato.length < 1) {
        alertError('Contato do Leitor não pode ser vazio!')
        return
    }
    let turma = document.getElementById("leitor-turma").value
    if (turma.length < 1) {
        alertError('Turma do Leitor não pode ser vazio!')
        return
    }
    return {
        "nome": nome,
        "contato": contato,
        "turma": turma
    }
}

function removeUser(id) {
    fetch(`http://localhost:5000/api/users/remove/${id}`)
        .then(res => {
            console.log(res)
            res.status == 200 ? alertSucess('Leitor removido com sucesso!') : alertError('Erro ao remover Leitor, Verifique se ele não está emprestado!')
            reloadUsers()
        }).catch(err => {
            console.log(err)
            alertError('Erro ao remover livro!')
        })
}

function genCardsEmp(name, id) {
    return `
    <div class="card mx-1 my-2">
<div class="card-body d-flex align-items-center justify-content-between">
    <h4 class="card-title mb-0">${name}</h4>
    <div><a href="/?emprestimo=${id}" class="btn btn-primary" type="button">Detalhes</a></div>
</div>
</div>
`

}