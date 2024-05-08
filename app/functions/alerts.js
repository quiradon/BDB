function alertSucess(text) {
    let texto_alerta = document.getElementById("texto-alerta-sucess");
    let toast_alerta = document.getElementById("alert-sucess");
    texto_alerta.innerHTML = text;
    toast_alerta.classList.add("show");
    setTimeout(function() {
        toast_alerta.classList.remove("show");
    }, 3000);
}

function alertError(texto) {
        let texto_alerta = document.getElementById("texto-alerta-danger");
        let toast_alerta = document.getElementById("alert-danger");
        texto_alerta.innerHTML = texto;
        toast_alerta.classList.add("show");
        setTimeout(function() {
            toast_alerta.classList.remove("show");
        }, 3000);
    
}