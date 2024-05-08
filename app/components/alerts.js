module.exports = `
<div id="alerts" class="toast-container position-fixed bottom-0 p-2">
    <div id="alert-danger" class="toast fade text-bg-danger border-0 align-items-center hide" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body"><span id="texto-alerta-danger"> Mensagem de Erro</span></div><button class="btn-close m-auto btn-close-white me-2" type="button" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
    <div id="alert-sucess" class="toast fade text-bg-success border-0 align-items-center hide" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body"><span id="texto-alerta-sucess"> Mensagem de Erro</span></div><button class="btn-close m-auto btn-close-white me-2" type="button" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
</div>
`