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
    let obs_pedido = document.getElementById("obs_pedido");

    // ------------------------------------------------------
    //RESTRINGIR TECLAS DO CNPJ PARA QUE O ANTA NAO COLOQUE LETRAS

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

    // ------------------------------------------------------
    //GUARDAR VALORES NO SESSION STORAGE PARA POSTERIORMENTE INSERIR NO PEDIDO

    btn_inserir.addEventListener("click", function () {
        if (
            !input_empresa.value.trim() || //nome do cliente patético.
            !input_city.value.trim() || //cidade do cliente.
            !input_uf.value.trim() || //estado do belissimo cliente.
            !input_contato.value.trim() || //nome da pessoa de contato, comprador etc.
            !input_fone_number.value.trim() || //numero dessa pessoa ridicula.
            !input_rep.value.trim()// nome do trouxa que atende ou vai atender esse povo.
        ) {
            alert("Por favor, preencha todos os campos Obrigatórios");

        }

        else {

            sessionStorage.setItem("empresa", input_empresa.value);
            sessionStorage.setItem("cnpj", input_cnpj.value);
            sessionStorage.setItem("endereco", input_end.value);
            sessionStorage.setItem("cidade", input_city.value);
            sessionStorage.setItem("uf", input_uf.value);
            sessionStorage.setItem("cep", input_cep.value);
            sessionStorage.setItem("contato", input_contato.value);
            sessionStorage.setItem("fone", input_fone_number.value);
            sessionStorage.setItem("representante", input_rep.value);

            sessionStorage.setItem("obs",obs_pedido.value)

            alert(
                `Empresa: ${sessionStorage.getItem("empresa")}\n` +
                `CNPJ: ${sessionStorage.getItem("cnpj")}\n` +
                `Endereço: ${sessionStorage.getItem("endereco")}\n` +
                `Cidade: ${sessionStorage.getItem("cidade")}\n` +
                `UF: ${sessionStorage.getItem("uf")}\n` +
                `CEP: ${sessionStorage.getItem("cep")}\n` +
                `Contato: ${sessionStorage.getItem("contato")}\n` +
                `Fone: ${sessionStorage.getItem("fone")}\n` +
                `Representante: ${sessionStorage.getItem("representante")}\n` +
                `Observação: ${sessionStorage.getItem("obs")}`
            );
            

        }

    });

});

