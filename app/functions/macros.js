document.addEventListener('keydown', function(event) {
    if (event.key === 'F1') {
        window.location.href = "/?modal=new";
    }

    if (event.key === 'F2') {
        window.location.href = "/leitores?modal=new";
    }
});