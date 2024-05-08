const {GenPage} = require("../buildStructure.js");
const {page} = require("../components/usersBar.js")
const modalFinal = require("../components/modalTodosOsEmp")
function requireUncached(module){
    delete require.cache[require.resolve(module)]
    return require(module)
}


function UsersPage () {
    
    let {modal} = require("../components/modalUsers.js")
    return GenPage(2,page(),`
    <script src="/functions/loadUsers.js"></script>
    `,
    `
    ${modal}
    ${modalFinal}
    `)

}

module.exports = {
    UsersPage
}