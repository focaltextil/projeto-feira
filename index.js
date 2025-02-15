window.addEventListener("DOMContentLoaded", async function () {
    // Carregar dados do Excel se não estiver no Session Storage
    if (!sessionStorage.getItem("base_produtos")) {
        await loadExcelData();
    }
    let products = JSON.parse(sessionStorage.getItem("base_produtos")) || [];

    // ------------------------------------------------------
    // VARIÁVEIS DE FORMULÁRIO

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

    const data = new Date().toISOString().split("T")[0];

    // ------------------------------------------------------
    // VARIÁVEIS DO PEDIDO

    let searchBox = document.getElementById("searchBox");
    let quantityBox = document.getElementById("quantityBox");
    let suggestions = document.getElementById("suggestions");
    let obs = document.getElementById("obs");
    let addBtn = document.getElementById("add-btn");
    let productTable = document.getElementById("productTable");
    let btn_fechar = document.getElementById("btn-fechar");
    let btn_abrir = document.getElementById("icone_add_produto");
    let modal = document.querySelector(".modal");
    const btn_pdf = document.getElementById("salvar_pdf");

    // ------------------------------------------------------
    // RESTRINGIR TECLAS DO CNPJ

    input_cnpj.addEventListener("keydown", function (event) {
        const teclasPermitidas = ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", ".", "/", "-"];
        if (!(/^[0-9]$/.test(event.key) || teclasPermitidas.includes(event.key))) {
            event.preventDefault();
        }
    });

    // ------------------------------------------------------
    // GUARDAR VALORES NO SESSION STORAGE

    btn_inserir.addEventListener("click", function () {
        if (
            !input_empresa.value.trim() ||
            !input_city.value.trim() ||
            !input_uf.value.trim() ||
            !input_contato.value.trim() ||
            !input_fone_number.value.trim() ||
            !input_rep.value.trim()
        ) {
            alert("Por favor, preencha todos os campos Obrigatórios");
        } else {
            sessionStorage.setItem("empresa", input_empresa.value);
            sessionStorage.setItem("cnpj", input_cnpj.value);
            sessionStorage.setItem("endereco", input_end.value);
            sessionStorage.setItem("cidade", input_city.value);
            sessionStorage.setItem("uf", input_uf.value);
            sessionStorage.setItem("cep", input_cep.value);
            sessionStorage.setItem("contato", input_contato.value);
            sessionStorage.setItem("fone", input_fone_number.value);
            sessionStorage.setItem("representante", input_rep.value);
            sessionStorage.setItem("obs", obs_pedido.value);

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

    // ------------------------------------------------------
    // FILTRAR E SUGERIR PRODUTOS

    function updateSuggestions(filter = "") {
        suggestions.innerHTML = "";
        let filterParts = filter.toLowerCase().split("%").filter(part => part.trim() !== "");
        let filtered = products.filter(item => filterParts.every(part => item.ARTIGO.toLowerCase().includes(part)));

        if (filtered.length > 0 && filter !== "") {
            suggestions.style.display = "flex";
            filtered.forEach(item => {
                let div = document.createElement("div");
                div.textContent = item.ARTIGO;
                div.onclick = function () {
                    searchBox.value = item.ARTIGO;
                    suggestions.style.display = "none";
                };
                suggestions.appendChild(div);
            });
        } else {
            suggestions.style.display = "none";
        }
    }

    searchBox.addEventListener("input", (e) => updateSuggestions(e.target.value));

    document.addEventListener("click", (e) => {
        if (!searchBox.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = "none";
        }
    });

    // ------------------------------------------------------
    // MODAL DE ADIÇÃO DE PRODUTOS

    btn_fechar.addEventListener("click", function () {
        modal.style.display = "none";
    });

    btn_abrir.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // ------------------------------------------------------
    // ARRAY PARA ITENS E MONTAR O PEDIDO

    const itens = [];

    addBtn.addEventListener("click", () => {
        let productName = searchBox.value.trim();
        let quantity = quantityBox.value.trim();
        let observation = obs.value.trim();

        if (productName === "" || quantity === "" || isNaN(quantity)) {
            alert("Campo Produto e QTD não podem ser vazios");
            return;
        }

        let product = products.find(item => item.ARTIGO === productName);
        let productCode = product ? product.COD : "Desenvolver";

        // Adiciona o item ao array
        itens.push({
            codigo: productCode,
            nome: productName,
            quantidade: quantity,
            observacao: observation
        });

        // Adiciona o item na tabela
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${productCode}</td>
            <td>${productName}</td>
            <td>${quantity}</td>
            <td>${observation}</td>
        `;
        productTable.appendChild(row);

        // Limpa os campos de entrada
        searchBox.value = "";
        quantityBox.value = "";
        obs.value = "";

        console.log(itens); // Ver o array no console
    });

    // ------------------------------------------------------
    // SALVAR O PDF

    function gerarPDF() {
        const { jsPDF } = window.jspdf;
        const elemento = document.querySelector("body");

        html2canvas(elemento).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width * 0.75;
            const imgHeight = canvas.height * 0.75;

            const scaleX = pdfWidth / imgWidth;
            const scaleY = pdfHeight / imgHeight;

            const scale = Math.min(scaleX, scaleY);

            const imgScaledWidth = imgWidth * scale;
            const imgScaledHeight = imgHeight * scale;

            pdf.addImage(imgData, "PNG", 0, 0, imgScaledWidth, imgScaledHeight);

            pdf.save("pedido.pdf");
        });
    }

    btn_pdf.addEventListener("click", gerarPDF);
});
