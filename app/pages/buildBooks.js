const {GenPage} = require("../buildStructure.js");
const {page} = require("../components/booksBar.js")
const modalDevolva = require("../components/modalDevolva.js")

async function BooksPage () {
    let {genModalLeitores} = require("../components/modalLeitores.js")
    const modalLeitos = await genModalLeitores()
    let {modal} = require("../components/modalBooks.js")
    return GenPage(0,page(),`
    <script src="/functions/loadBooks.js"></script>
    `,
    `
    ${modal}
    ${modalLeitos}
    ${modalDevolva}
    `)

}

module.exports = {
    BooksPage
}