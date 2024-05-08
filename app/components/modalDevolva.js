module.exports = `
<div id="Modal_Devolucao" class="modal fade" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                        <path d="M96 0C60.7 0 32 28.7 32 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H96zM208 288h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V80zM496 192c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V336z"></path>
                    </svg> <strong id="titulo-modal">Devolução [PLACEHOLDER LIVRO]</strong></h4><button class="btn-close" aria-label="Close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body">
                <form>
                    <p class="mb-2">Leitor: <strong id="nome_placeholder-devolucao_leitor">Bold</strong></p>
                    <p class="mb-2">Data do Emprestimo: <strong id="nome_placeholder-devolucao_data_inicial">Bold</strong></p>
                    <p class="mb-2">Data Final: <strong id="nome_placeholder-devolucao_data_final">Bold</strong></p>
                </form>
                <div class="row">
                    <div class="col text-end mt-5"><button onclick="devolva()" class="btn btn-primary m-2" type="button" data-bs-target="#Devolucao-modal">Efetuar Devolução</button></div>
                </div>
            </div>
        </div>
    </div>
</div>`