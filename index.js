window.addEventListener("DOMContentLoaded", function(){

    const btn_inserir = document.getElementById("btn-pedido");

    let input_empresa = document.getElementById("empresa");
    let input_cnpj = document.getElementById("cnpj");
    let input_contato = document.getElementById("contato");
    let input_fone_number = document.getElementById("telefone");
    let input_rep = document.getElementById("rep");


    // ------------------------------------------------------

    
    btn_inserir.addEventListener("click", function() {
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


        window.location.href = './pedido.html';
    });

});

