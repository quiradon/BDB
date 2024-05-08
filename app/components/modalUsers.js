const turmas = require("../../configs.json").turmas
let tagsOptions = ""
turmas.forEach(turma => {
    tagsOptions += `<option value="${turma.value}">${turma.nome}</option>`
})
let modal = `
<div id="Modal_Leitor" class="modal fade " role="dialog" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"><svg class="mb-1 me-2" xmlns="http://www.w3.org/2000/svg" viewBox="-32 0 512 512" width="1em" height="1em" fill="currentColor">
                        <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"></path>
                    </svg>Leitor</h4><button class="btn-close" aria-label="Close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body">
                <form>
                    <p class="text-start" style="margin-bottom: 5px;font-weight: bold;"><span style="font-weight: normal !important;">Nome: </span></p><input id="leitor-nome" class="form-control form-control-sm" type="text" placeholder="João" required minlength="1" autocomplete="off" />
                    <p class="text-start" style="margin-bottom: 5px;font-weight: bold;"><span style="font-weight: normal !important;">Contato: </span></p><input id="leitor-contato" class="form-control form-control-sm" type="text" placeholder="(84) 1234-5678 | exemplo@email.com" required minlength="1" autocomplete="off" />
                    <p class="text-start" style="margin-bottom: 5px;font-weight: bold;"><span style="font-weight: normal !important;">Turma: </span></p><select id="leitor-turma" class="bg-dark form-select form-select-sm selectpicker p-0" data-live-search="true" data-width="100%" data-bs-theme="dark" data-style="btn-dark">
                        ${tagsOptions}
                    </select>
                    <div class="col d-xl-flex justify-content-xl-end" style="text-align: right;"><button id="modal_btn_save_leitor" onclick="addUser()" class="btn btn-primary d-flex justify-content-center align-items-center justify-content-xl-center mt-4" type="button"><svg class="me-1" xmlns="http://www.w3.org/2000/svg" viewBox="-32 0 512 512" width="1em" height="1em" fill="currentColor">
                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                            </svg>Adicionar Leitor</button><button onclick="editUser()" id="modal_btn_edit_leitor" class="btn btn-primary mt-4" type="button"><svg class="m-1" xmlns="http://www.w3.org/2000/svg" viewBox="-32 0 512 512" width="1em" height="1em" fill="currentColor">
                                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path>
                            </svg>Salvar Edição</button></div>
                </form>
            </div>
        </div>
    </div>
</div>
`

module.exports = {
    modal
}