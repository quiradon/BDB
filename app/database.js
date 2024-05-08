const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("books.db");
db.run(`PRAGMA foreign_keys = ON;`);
//Criar Banco de Dados
db.serialize(function() {
    db.run(`CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        editora TEXT,
        tags TEXT,
        isbn TEXT
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS leitores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        turma TEXT NOT NULL,
        contato TEXT NOT NULL
    );`);
   db.run(`CREATE TABLE IF NOT EXISTS emprestimos (
        livro_id INTEGER NOT NULL PRIMARY KEY,
        leitor_id INTEGER NOT NULL,
        data_emprestimo TEXT NOT NULL,
        data_prazo TEXT NOT NULL,
        FOREIGN KEY(livro_id) REFERENCES livros(id) ON DELETE RESTRICT,
        FOREIGN KEY(leitor_id) REFERENCES leitores(id) ON DELETE RESTRICT
    );`);
db.run(`CREATE VIEW IF NOT EXISTS leitores_infos AS
    SELECT leitores.id, leitores.nome, leitores.turma, leitores.contato, 
    COUNT(emprestimos.data_emprestimo) as emprestimos,
    IFNULL(GROUP_CONCAT(emprestimos.livro_id), '') as livros_emprestados_ids,
    IFNULL(GROUP_CONCAT(livros.titulo), '') as livros_emprestados_nomes
    FROM leitores
    LEFT JOIN emprestimos ON leitores.id = emprestimos.leitor_id
    LEFT JOIN livros ON emprestimos.livro_id = livros.id
    GROUP BY leitores.id;`);
db.run(`CREATE VIEW IF NOT EXISTS livros_infos AS
    SELECT livros.*, 
    CASE 
        WHEN emprestimos.data_emprestimo IS NULL THEN 0
        WHEN emprestimos.data_emprestimo <= strftime('%s','now') AND (emprestimos.data_prazo IS NULL OR emprestimos.data_prazo >= strftime('%s','now')) THEN 1
        WHEN emprestimos.data_prazo < strftime('%s','now') THEN 2
    END as status,
    emprestimos.leitor_id,
    leitores.nome as leitor_nome,
    leitores.turma as leitor_turma,
    emprestimos.data_emprestimo,
    emprestimos.data_prazo
    FROM livros
    LEFT JOIN emprestimos ON livros.id = emprestimos.livro_id
    LEFT JOIN leitores ON emprestimos.leitor_id = leitores.id;`);
    //Crie uma view chamada pendencias que retorna todos os livros com a data de devolução vencida.
db.run(`CREATE VIEW IF NOT EXISTS pendencias AS
    SELECT livros.id as livro_id, livros.titulo as titulo, emprestimos.data_emprestimo, emprestimos.data_prazo, 
    leitores.id as leitor_id, leitores.nome as leitor, leitores.turma as turma
    FROM livros
    JOIN emprestimos ON livros.id = emprestimos.livro_id
    JOIN leitores ON emprestimos.leitor_id = leitores.id
    WHERE emprestimos.data_prazo < strftime('%s','now');`);
});
db.run(`CREATE VIEW IF NOT EXISTS estatisticas AS
    SELECT 
        (SELECT COUNT(*) FROM leitores) as total_usuarios,
        (SELECT COUNT(DISTINCT leitor_id) FROM emprestimos) as usuarios_com_emprestimos,
        (SELECT COUNT(*) FROM livros) as total_livros,
        (SELECT COUNT(*) FROM emprestimos WHERE data_prazo >= strftime('%s','now')) as livros_emprestados,
        (SELECT COUNT(*) FROM emprestimos WHERE data_prazo < strftime('%s','now')) as livros_atrasados;`);



//crie um arquivo config.json caso não exista
const fs = require("fs");

if (!fs.existsSync("config.json")) {
    fs.writeFileSync("config.json", JSON.stringify({
            "max_per_user" : 2,
            "tags" : [
                "Enem-Concursos",
                "Petrolina",
                "Direito","Politica",
                "Meio Ambiente",
                "Diversos",
                "Dicionários",
                "Enciclopédias",
                "Sequenciais",
                "Contos",
                "Romance",
                "Infanto-Juvenil",
                "HQs",
                "Espiritualidade",
                "Poesia",
                "Empreendedorismo",
                "Cronica",
                "Educação",
                "Nutrição",
                "Ficção",
                "Informatica",
                "Literatura",
                "Cordel",
                "Biologia",
                "Historia",
                "Geografia",
                "Filosofia",
                "Sociologia",
                "Artes",
                "Matemática",
                "Física",
                "Química",
                "Espanhol",
                "Inglês",
                "Português",
                "Revistas",
                "Biografias",
                "Autoajuda",
                "Administração",
                "Potiguar",
                "Nordestino",
                "Acervo Secreto",
                "Norte Rio Grandense"
        
        
            ],
            "turmas" : [
            {
            "nome" : "1A - Nutrição",
            "value" : "1A-ND"
            },
            {
                "nome" : "1A - Meio Ambiente",
                "value" : "1A-MA"
            },
            {
                "nome" : "1B - Nutrição",
                "value" : "1B-ND"
            },
            {
                "nome" : "1B - Meio Ambiente",
                "value" : "1B-MA"
            },
            {
                "nome" : "2A - Nutrição",
                "value" : "2A-ND"
            },
            {
                "nome" : "2A - Meio Ambiente",
                "value" : "2A-MA"
            },
            {
                "nome" : "2B - Nutrição",
                "value" : "2B-ND"
            },
            {
                "nome" : "2B - Meio Ambiente",
                "value" : "2B-MA"
            },
            {
                "nome" : "3A - Nutrição",
                "value" : "3A-ND"
            },
            {
                "nome" : "3A - Meio Ambiente",
                "value" : "3A-MA"
            },
            {
                "nome" : "3B - Nutrição",
                "value" : "3B-ND"
            },
            {
                "nome" : "3B - Meio Ambiente",
                "value" : "3B-MA"
            }
        ]
    }));
}

module.exports = {
    db
}