express = require('express')
app = express()
const bodyParser = require('body-parser');
const configPage = require("./pages/buildConfigs.js")
const configFile = require("./../configs.json")

const {db} = require("./database.js");

function requireUncached(module){
    delete require.cache[require.resolve(module)]
    return require(module)
}

app.use(bodyParser.json());
app.use('/assets', express.static(__dirname + '/assets'))

app.use('/functions', express.static(__dirname + '/functions'))

//* APIS Livos

//Coletar Livro especifico
app.get('/api/books/:id', ({ params: { id } }, res) => {
    db.get(`SELECT * FROM livros_infos WHERE id = ?`, id, function(err, row) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        if (row) {
            res.status(200).send(row);
        } else {
            res.status(404).send({ error: 'Livro não encontrado' });
        }
    });
})

app.get('/api/status', (_, res) => {
    db.all(`SELECT * FROM estatisticas`, function(err, rows) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        res.status(200).send(rows);
    });
});
//Coletar todos os Livros
app.get('/api/books/', (_, res) => {
    db.all(`SELECT * FROM livros_infos`, function(err, rows) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        res.status(200).send(rows);
    });
})

app.get('/api/pendencias/', (_, res) => {
    db.all(`SELECT * FROM pendencias`, function(err, rows) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        res.status(200).send(rows);
    });
})
//Remover Livro
app.use('/api/book/remove/:id', (req, res) => {
    db.run(`DELETE FROM livros WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err.message });
        } else {
            res.send("Livro removido com sucesso!")
        }
    });
}
)

app.use('/api/books/devolucao/:id', (req, res) => {
    db.run(`DELETE FROM emprestimos WHERE livro_id = ?`, req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err.message });
        } else {
            res.send("Devolução realizada com sucesso!")
        }
    });
})

//Adicionar Livro
app.use('/api/book/add', (req, res) => {
    const { titulo, autor, editora, isbn, tags } = req.body
    db.run(`INSERT INTO livros (titulo, autor, editora, isbn, tags) VALUES (?,?,?,?,?)`, titulo, autor, editora, isbn, tags, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Livro adicionado com sucesso!")
        }
    });
}
)

app.use('/api/book/edit/:id', (req, res) => {
    const { titulo, autor, editora, isbn, tags } = req.body
    db.run(`UPDATE livros SET titulo = ?, autor = ?, editora = ?, isbn = ?, tags = ? WHERE id = ?`, titulo, autor, editora, isbn, tags, req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Livro atualizado com sucesso!")
        }
    });
}
)


const fs = require('fs');
const path = require('path');

app.get('/export/users', (req, res) => {
    db.all(`SELECT * FROM leitores`, function(err, rows) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }

        const data = JSON.stringify(rows, null, 2);
        const filePath = path.join(__dirname, 'leitores.json');
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                res.status(500).send({ error: err.message });
                return;
            }

            res.download(filePath, (err) => {
                if (err) {
                    fs.unlinkSync(filePath);
                    res.status(500).send({ error: err.message });
                }
            });
        });
    });
});

app.get('/export/books', (req, res) => {
    db.all(`SELECT * FROM livros`, function(err, rows) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }

        const data = JSON.stringify(rows, null, 2);
        const filePath = path.join(__dirname, 'livros.json');
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                res.status(500).send({ error: err.message });
                return;
            }

            res.download(filePath, (err) => {
                if (err) {
                    fs.unlinkSync(filePath);
                    res.status(500).send({ error: err.message });
                }
            });
        });
    });
})

//! APIS Leitores
app.use('/api/users/remove/:id', (req, res) => {
    db.run(`DELETE FROM leitores WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err.message });
        } else {
            res.send("Leitor removido com sucesso!")
        }
    });
}
)

//Coletar todos os Usuarios

app.use('/api/users/add', (req, res) => {
    const { nome, contato, turma } = req.body
    db.run(`INSERT INTO leitores (nome, contato, turma) VALUES (?,?,?)`, nome, contato, turma, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Leitor adicionado com sucesso!")
        }
    });
})

app.use('/api/users/edit/:id', (req, res) => {
    const { nome, contato, turma } = req.body
    db.run(`UPDATE leitores SET nome = ?, contato = ?, turma = ? WHERE id = ?`, nome, contato, turma, req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Leitor atualizado com sucesso!")
        }
    });
})

app.use('/api/users/:id', (req, res) => {
    db.get(`SELECT * FROM leitores_infos WHERE id = ?`, req.params.id, function(err, row) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        if (row) {
            res.status(200).send(row);
        } else {
            res.status(404).send({ error: 'Leitor não encontrado' });
        }
    });
})

app.get('/api/users/', (_, res) => {
    db.all(`SELECT * FROM leitores_infos`, function(err, rows) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        res.status(200).send(rows);
    });
})




//* Api Emprestimos
//rota para realizar emprestimo
app.post('/api/emprestimo', (req, res) => {
    const { livro_id, leitor_id, data, data_devolucao } = req.body

    //verifique se o usuario não excedeu o limite de emprestimos
    db.get(`SELECT COUNT(*) as emprestimos FROM emprestimos WHERE leitor_id = ?`, leitor_id, function(err, row) {  
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        if (row.emprestimos >= configFile.max_per_user) {
            res.status(400).send({ error: 'Leitor excedeu o limite de emprestimos' });
            return;
        } else {
            db.run(`INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_prazo) VALUES (?,?,?,?)`, livro_id, leitor_id, data, data_devolucao, function(err) {
                if (err) {
                    res.status(500).send({ error: err.message });
                    console.log(err);
                } else {
                    res.send("Emprestimo realizado com sucesso!")
                }
            });
        }
    });


})


//! API GERAL
app.get('/api/config', (req, res) => {
    let config = requireUncached('./../configs.json');
    res.send(config);
})


//* Rotas de Páginas
app.get('/config', (req, res) => {
    res.send(configPage)
}
)

app.get('/leitores', (req, res) => {
    let {UsersPage} = requireUncached("./pages/buildUsers.js")
    res.send(UsersPage())
}
)

app.get('/status', async (req, res) => {
    let {StatusPage} = requireUncached("./pages/buildStats.js") 
    res.send(await StatusPage())
})

app.get('/donate', async (req, res) => {
    let {DonatePage} = requireUncached("./pages/buildDonate.js")
    res.send(await DonatePage())
})

app.get('/', async (req, res) => {
    let {BooksPage} = requireUncached("./pages/buildBooks.js")
    res.send(await BooksPage())
})

/** 
 *? Iniciar Servidor!
 * */ 
app.listen(5000, () => {
    console.log('Example app listening on port 5000!')
}
)
