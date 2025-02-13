window.addEventListener("DOMContentLoaded", function () {

    const btn_inserir = document.getElementById("concluir-btn");
    let input_empresa = document.getElementById("cliente");
    let input_cnpj = document.getElementById("cnpj");
    let input_end = document.getElementById("end");
    let input_city = document.getElementById("cidade");
    let input_uf = document.getElementById("select");
    let input_cep = document.getElementById("cep");
    let input_contato = document.getElementById("contato");
    let input_fone_number = document.getElementById("telefone");
    let input_rep = document.getElementById("rep");

    // ------------------------------------------------------



    cnpj.addEventListener("keydown", function (event) {

        const teclasEspeciais = [8, 9, 46, 37, 39];

        if (
            (event.key >= '0' && event.key <= '9') ||
            event.key === '.' ||
            event.key === '/' ||
            event.key === '-' ||
            teclasEspeciais.includes(event.keyCode)
        ) {
            return;
        } else {
            event.preventDefault();
        }
    });

    btn_inserir.addEventListener("click", function () {
        if (
            !input_empresa.value.trim() ||
            !input_contato.value.trim() ||
            !input_fone_number.value.trim() ||
            !input_rep.value.trim()
        ) {
            alert("Por favor, preencha todos os campos Obrigatórios");
            return;
        }

        sessionStorage.setItem("empresa", input_empresa.value);
        sessionStorage.setItem("cnpj", input_cnpj.value);
        sessionStorage.setItem("contato", input_contato.value);
        sessionStorage.setItem("fone", input_fone_number.value);
        sessionStorage.setItem("representante", input_rep.value);

    });

});

