let SelectedBook = null
let statusBadge = ["<span class=\"badge bg-success\">Pratileira</span>", "<span class=\"badge bg-warning\">Emprestado</span>", "<span class=\"badge bg-danger\">Atrasado</span>"]
function buildCard(id, title, author,editor , isbn, status, tags) {
    tags = tags.split(',')
    tags = tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`)
    tags = tags.join('')
    return `
    <div class="card shadow-sm m-2">
    <div class="card-body">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-6">
                    <h5 class="fw-bold">${title}</h5>
                    <p class="mb-1">Informações: Author: ${author} | Editora:  ${editor} | ISBN: ${isbn}</p>
                    <p class="mb-1">Status: ${statusBadge[status]}</p>${tags}
                </div>
                <div class="col d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-sm-end align-items-sm-center justify-content-md-end align-items-md-center justify-content-lg-end align-items-lg-center justify-content-xl-end align-items-xl-center">
                    <div class="dropdown mt-1"><button class="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button"><svg class="mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="-32 0 512 512" width="1em" height="1em" fill="currentColor" style="margin-right: 6px;font-size: 16px;">
                                <path d="M201 10.3c14.3-7.8 31.6-7.8 46 0L422.3 106c5.1 2.8 8.3 8.2 8.3 14s-3.2 11.2-8.3 14L231.7 238c-4.8 2.6-10.5 2.6-15.3 0L25.7 134c-5.1-2.8-8.3-8.2-8.3-14s3.2-11.2 8.3-14L201 10.3zM23.7 170l176 96c5.1 2.8 8.3 8.2 8.3 14V496c0 5.6-3 10.9-7.8 13.8s-10.9 3-15.8 .3L25 423.1C9.6 414.7 0 398.6 0 381V184c0-5.6 3-10.9 7.8-13.8s10.9-3 15.8-.3zm400.7 0c5-2.7 11-2.6 15.8 .3s7.8 8.1 7.8 13.8V381c0 17.6-9.6 33.7-25 42.1L263.7 510c-5 2.7-11 2.6-15.8-.3s-7.8-8.1-7.8-13.8V280c0-5.9 3.2-11.2 8.3-14l176-96z"></path>
                            </svg>Ações</button>
                        <div class="dropdown-menu"><a class="dropdown-item" href="/?modal=${id}">Editar Livro</a><a class="dropdown-item" href="/?emprestimo=${id}" >Emprestimo</a><a class="dropdown-item" href="#" onclick="removeBook(${id})">Deletar</a></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
}
let booksList = document.getElementById('books-list-cards')
//o termo está sendo passado via query string
let searchTerm = new URLSearchParams(window.location.search).get('search') || ''
fetch('http://localhost:5000/api/books')
    .then(res => res.json())
    .then(data => {
        //console.log(data)
        if (data.length == 0) {
            //return alertError('Não há livros cadastrados!')
        }
        if (searchTerm) {
            searchTerm = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            data = data.filter(book => 
                book.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm) ||
                book.autor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm) ||
                book.editora.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm) ||
                book.isbn.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm) ||
                book.tags.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchTerm)
            );
            if (data.length == 0) {
                return alertError('Não consegui achar nem um livro em sua pesquisa!')
            }
        }
        // Ordena os livros por ordem alfabética
        data.sort((a, b) => a.titulo.localeCompare(b.titulo));
        data.forEach(book => {
            booksList.innerHTML += buildCard(book.id, book.titulo, book.autor, book.editora, book.isbn, book.status, book.tags)
        })
    })



const modal = document.getElementById('Modal_Livro')
//* Sistema de Edição de Livros
if (new URLSearchParams(window.location.search).get('modal')) {
    let valor = new URLSearchParams(window.location.search).get('modal')
    if (valor == 'new') {
        setModalType('new')
        let myModal = new bootstrap.Modal(modal)
        myModal.show()
    } else {
        fetch(`http://localhost:5000/api/books/${valor}`)
            .then(response => {
                if (response.status == 404) {
                    alertError('Livro não encontrado!')
                    return
                }
                return response.json();
            })
            .then(data => {
                    SelectedBook = parseInt(valor)
                    document.getElementById("book-name").value = data.titulo
                    document.getElementById("book-autor").value = data.autor
                    document.getElementById("book-editora").value = data.editora
                    document.getElementById("book-tags").value = data.tags
                    document.getElementById("book-isbn").value = data.isbn
                    $('#book-tags').selectpicker('val', data.tags.split(',')); 
                    setModalType('edit')
                    let myModal = new bootstrap.Modal(modal)
                    myModal.show()
            })
        }
    
    
}

const ModalEmprestimos = document.getElementById('Modal_Emprestimo')
const modalDevolva = document.getElementById('Modal_Devolucao')
if (new URLSearchParams(window.location.search).get('emprestimo')) {
    //TODO: Implementar sistema de emprestimo
    let alvo = new URLSearchParams(window.location.search).get('emprestimo')
    //deve-se verificar o status do emprestimo para exibir 2 modals diferentes a rota de consulta é /api/books/:id
    fetch(`http://localhost:5000/api/books/${alvo}`).then(response => {
        if (response.status == 404) {
            alertError('Livro não encontrado!')
            return
        }
        return response.json();
    }).then(data => {
            SelectedBook = parseInt(alvo)
            let status = data.status
            console.log(status)
            if (status == 0) {
                let editBook = document.getElementById('nome_do_livro_titulo_emprestimo')
                console.log(data)
                editBook.innerHTML = data.titulo
                let modalEmp = new bootstrap.Modal(ModalEmprestimos)
                modalEmp.show()
            } else {
                console.log(data)
                let tituloModal = document.getElementById('titulo-modal')
                let nomeLeitor = document.getElementById('nome_placeholder-devolucao_leitor')
                tituloModal.innerHTML = data.titulo
                nomeLeitor.innerHTML = data.leitor_nome + ' | ' + data.leitor_turma

                let dataInicial = document.getElementById('nome_placeholder-devolucao_data_inicial')
                let dataFinal = document.getElementById('nome_placeholder-devolucao_data_final')

                let dataEmprestimo = new Date(data.data_emprestimo * 1);
                let dataDevolucao = new Date(data.data_prazo * 1);
                //há uma condição para verificar se a data de devolução já passou

                if (dataDevolucao < new Date()) {
                    dataFinal.classList.add('text-danger')
                } else {
                    dataFinal.classList.add('text-success')
                } 
                //timestamp relativo 
                relativo = dataDevolucao - new Date() 
                dataInicial.innerHTML = dataEmprestimo.toLocaleDateString()
                dataFinal.innerHTML = dataDevolucao.toLocaleDateString() + ' | ' + Math.floor(relativo / (1000 * 60 * 60 * 24)) + ' dias restantes'
                
                let modalDev = new bootstrap.Modal(modalDevolva)
                modalDev.show()
                console.log('Devolver')
            }
    })

}

if (new URLSearchParams(window.location.search).get('atrasos')) {
    //mostrar todos os livros que estão atrasados
fetch('http://localhost:5000/api/books')
    .then(response => {
        if (response.status == 404) {
            alertError('Nenhum livro atrasado!')
            return
        }
        return response.json()
    }).then(data => {
        const filteredBooks = data.filter(book => book.status == 2);
        if (filteredBooks.length == 0) {
            alertError('Nenhum livro atrasado!')
            return
        }
        booksList.innerHTML = ''
        filteredBooks.forEach(book => {
            booksList.innerHTML += buildCard(book.id, book.titulo, book.autor, book.editora, book.isbn, book.status, book.tags)
        })
    })
}

function getModalData() {
    let titulo_book = document.getElementById("book-name").value ?? "";
    let autor = document.getElementById("book-autor").value ?? "";
    let editora = document.getElementById("book-editora").value ?? "";
    let bookTagsSelect = document.getElementById("book-tags");
    let selectedValues = new Array();
    for (var i = 0; i < bookTagsSelect.options.length; i++) {
        if (bookTagsSelect.options[i].selected) {
        selectedValues.push(bookTagsSelect.options[i].value);
        }
    }
    var tags = selectedValues.join(",");
    var isbn = document.getElementById("book-isbn").value ?? "";
    if (titulo_book === "") {
        alertError("O campo título é obrigatório!");
        return;
    }
    if (autor === "") {
        alertError("O campo autor é obrigatório!");
        return;
    }
    if (editora === "") {
        alertError("O campo editora é obrigatório!");
        return;
    }
    if (tags === "") {
        alertError("O campo tags é obrigatório!");
        return;
    }
    if (isbn === "") {
        alertError("O campo ISBN é obrigatório!");
        return;
    }

    return {
        titulo: titulo_book,
        autor: autor,
        editora: editora,
        tags: tags,
        isbn: isbn
    }
}


function setModalType(type) {
    if (type == 'new') {
        //oculte o botão de id modal_btn_edit_book removendo a classe d-flex e adicionando a d-none
        document.getElementById('modal_btn_edit_book').classList.remove('d-flex')
        document.getElementById('modal_btn_edit_book').classList.add('d-none')
        document.getElementById('modal_btn_save_book').classList.remove('d-flex')
    } else {
        //faça o contrário
        document.getElementById('modal_btn_save_book').classList.remove('d-flex')
        document.getElementById('modal_btn_save_book').classList.add('d-none')
        document.getElementById('modal_btn_edit_book').classList.remove('d-none')
        document.getElementById('modal_btn_edit_book').classList.add('d-flex')

    }

}

function addBook() {
    let data = getModalData()   
    if (data != undefined) {
        fetch('http://localhost:5000/api/book/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            titulo: data.titulo,
            autor: data.autor,
            editora: data.editora,
            isbn: data.isbn,
            tags: data.tags
        })
    }).then(res => {
        res.text()
        $('#Modal_Livro').modal('hide');
        reloadBooks()
        alertSucess('Livro adicionado com sucesso!')
    }).catch(err => {
        console.log(err)
        alertError('Erro ao adicionar livro!')
    })
    }
}

function editBook(){
    let data = getModalData()
    if (data != undefined) {
        fetch(`http://localhost:5000/api/book/edit/${SelectedBook}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            titulo: data.titulo,
            autor: data.autor,
            editora: data.editora,
            isbn: data.isbn,
            tags: data.tags
        })
    }).then(res => {
        res.text()
        $('#Modal_Livro').modal('hide');
        reloadBooks()
        alertSucess('Livro editado com sucesso!')
    }).catch(err => {
        //console.log(err)
        alertError('Erro ao editar livro!')
    })
    }

}

function reloadBooks() {
    fetch('http://localhost:5000/api/books')
        .then(res => res.json())
        .then(data => {
            booksList.innerHTML = ''
            // Ordena os livros por ordem alfabética pelo título
            data.sort((a, b) => a.titulo.localeCompare(b.titulo));
            data.forEach(book => {
                booksList.innerHTML += buildCard(book.id, book.titulo, book.autor, book.editora, book.isbn, book.status ?? 1, book.tags)
            })
        })
}

function removeBook(id) {
    fetch(`http://localhost:5000/api/book/remove/${id}`)
        .then(res => {
            res.status == 200 ? alertSucess('Livro removido com sucesso!') : alertError('Erro ao remover livro, Verifique se ele não está emprestado!')
            reloadBooks()
        }).catch(err => {
            //console.log(err)
            alertError('Erro ao remover livro!')
        })
}

function emprestimo() {
let leitor = document.getElementById('seletor_leitor_emprestimo').value;
let livro = SelectedBook;
let prazo = parseInt(document.getElementById('seletor_de_tempo_do_emprestimo').value);

let dataAtual = new Date();
let data = dataAtual.getTime();
dataAtual.setDate(dataAtual.getDate() + prazo);
let data_devolucao = dataAtual.getTime();

console.log(data)
console.log(data_devolucao)
fetch('http://localhost:5000/api/emprestimo', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        livro_id: livro,
        leitor_id: leitor,
        data: data,
        data_devolucao: data_devolucao
    }),
})
.then(response => {
    if (response.status == 200) {
        alertSucess('Emprestimo realizado com sucesso!')
        //feche o modal
        $('#Modal_Emprestimo').modal('hide');
        reloadBooks()
    } else {
        alertError('Erro ao realizar emprestimo! Verifique se o livro já não está emprestado! ou se o leitor já não atingiu o limite de emprestimos!')
    }
    
})

.catch((error) => {
    console.error('Error:', error);
});}

function devolva() {
    //rota para realizar a devolução /api/books/devolucao/:id
    fetch(`http://localhost:5000/api/books/devolucao/${SelectedBook}`)
    .then(response => {
        if (response.status == 200) {
            alertSucess('Devolução realizada com sucesso!')
            //feche o modal
            $('#Modal_Devolucao').modal('hide');
            reloadBooks()
        } else {
            alertError('Erro ao realizar devolução!')
        }
    })
}