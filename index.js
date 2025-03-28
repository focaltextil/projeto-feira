window.addEventListener("DOMContentLoaded", async function () {

    if (!sessionStorage.getItem("base_produtos")) {
        await loadExcelData();
    }
    let products = JSON.parse(sessionStorage.getItem("base_produtos")) || [];

    // ------------------------------------------------------
    // VARIAVEIS DO CLIENTE

    const btn_concluir = document.getElementById("concluir-btn");
    let input_empresa = document.getElementById("cliente");
    let input_cnpj = document.getElementById("cnpj");
    let input_end = document.getElementById("end");
    let input_city = document.getElementById("cidade");
    let input_uf = document.getElementById("select");
    let input_cep = document.getElementById("cep");
    let input_contato = document.getElementById("contato");
    let input_fone_number = document.getElementById("telefone");
    let input_rep = document.getElementById("rep");
    let mtd_payment = document.getElementById("mtd_pagamento");


    const wait_modal = document.getElementById('loading-modal');
    const data = new Date().toISOString().split("T")[0];

    // ------------------------------------------------------
    // VARIAVEIS DO PEDIDO

    let searchBox = document.getElementById("searchBox");
    let quantityBox = document.getElementById("quantityBox");
    let suggestions = document.getElementById("suggestions");
    let obs_item = document.getElementById("obs_item");
    let obs_pedido = document.getElementById("obs_pedido");
    let addBtn = document.getElementById("add-btn");
    let productTable = document.getElementById("productTable");
    let btn_fechar = document.getElementById("btn-fechar");
    let btn_add_item = document.getElementById("icone_add_produto");
    let modal = document.querySelector(".modal");
    let reiniciar_btn = document.getElementById("reiniciar-btn");
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
    // CONLUIR PEDIDO

    btn_concluir.addEventListener("click", function () {

        wait_modal.style.display = "flex";

        if (
            !input_empresa.value.trim() ||
            !input_city.value.trim() ||
            !input_uf.value.trim() ||
            !input_contato.value.trim() ||
            !input_fone_number.value.trim() ||
            !input_rep.value.trim()
        ) {
            alert("Não é possível inserir um pedido em branco");
        } else if (itens.length === 0) { 
            alert("Você precisa adicionar pelo menos um item ao pedido.");
        } else {
            itens.forEach(item => {
                item.obs_pedido = obs_pedido.value;
            });

            
            fetch('http://192.168.1.176:65000/order_input', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itens)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro na conexão API');
                }
            })
            .then(data => {
                alert('Pedido inserido com sucesso!');
                wait_modal.style.display = "none";
                gerarPDF();
                let campos = document.querySelectorAll(".entrada");
                campos.forEach(campo => {
                    campo.value = "";
                });
    
                itens.length = 0;
                renderizarTabela();
                Renderizar_card();
            })
            .catch(error => {
                console.error('Erro:', error);
                alert(`Erro ao Inserir Pedido!`);
                wait_modal.style.display = "none";
                
            });
        }
    });
    

    // ------------------------------------------------------
    // RENDERIZAR A TABELA DE PEDIDOS

    function renderizarTabela() {
        let tabela = document.querySelector("#productTable");
    
 
        let rows = tabela.querySelectorAll("tr:not(:first-child)");
        rows.forEach(row => {
            row.remove();
        });
    }
    

    function updateSuggestions(filter = "") {
        suggestions.innerHTML = "";
    
        if (!filter.trim()) {
            suggestions.style.display = "none";
            return;
        }
    
        let filterParts = filter.toLowerCase().split("%").filter(part => part.trim() !== "");
    
        let filtered = products.filter(item => {
            let article = item.ARTIGO.toLowerCase();

            if (!article.startsWith(filterParts[0])) return false;
    
            return filterParts.slice(1).every(part => article.includes(part));
        });
    
        if (filtered.length > 0) {
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
    // MODAL DE ADICAO DE PRODUTOS

    btn_fechar.addEventListener("click", function () {
        modal.style.display = "none";
    });

    btn_add_item.addEventListener("click", function () {
        if (
            !input_empresa.value.trim() ||
            !input_city.value.trim() ||
            !input_uf.value.trim() ||
            !input_contato.value.trim() ||
            !input_fone_number.value.trim() ||
            !input_rep.value.trim()
        ) {
            alert("Os Campos com * São obrigatórios");
            return;
        }
    
        modal.style.display = "block";
    });

    reiniciar_btn.addEventListener("click", function(){

        obs_pedido.value = "";
        renderizarTabela();  
        Renderizar_card();  
    });
    
    // ------------------------------------------------------
    // ARRAY PARA ITENS E MONTAR O PEDIDO

    const itens = [];

    addBtn.addEventListener("click", () => {
        let productName = searchBox.value.trim();
        let quantity = quantityBox.value.trim();
        let observation = obs_item.value.trim();
    
        if (productName === "" || quantity === "" || isNaN(quantity)) {
            alert("Campo Produto e QTD não podem ser vazios");
            return;
        }
    
        let product = products.find(item => item.ARTIGO === productName);
        let productCode = product ? product.COD : "Desenvolver";
    
        let newItem = {
            data: data,
            cliente: input_empresa.value,
            cnpj: input_cnpj.value,
            endereco: input_end.value,
            cidade: input_city.value,
            uf: input_uf.value,
            cep: input_cep.value,
            nome_contato: input_contato.value,
            telefone: input_fone_number.value,
            representante: input_rep.value,
            codigo: productCode,
            produto: productName,
            qtd: quantity,
            obs_item: observation,
            metodo_pagamento: mtd_payment.value,
        };

        
        itens.push(newItem);
    
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${productCode}</td>
            <td>${productName}</td>
            <td>${quantity}</td>
            <td contenteditable="true" class="editable-obs" style="outline: none">${observation}</td>
            <td><img src="./trash-bin.png" class="btn-delete" style="cursor: pointer;"></td>
        `;
    
        productTable.appendChild(row);
    
        row.querySelector(".btn-delete").addEventListener("click", function () {
            let index = itens.findIndex(item => item.produto === productName && item.qtd === quantity);
            if (index !== -1) {
                itens.splice(index, 1);
            }
            row.remove();
            Renderizar_card();
        });
    
        searchBox.value = "";
        quantityBox.value = "";
        obs_item.value = "";
        Renderizar_card();
    });
    
    
    function Renderizar_card() {
        const cardsContainer = document.getElementById("cardsContainer");
        cardsContainer.innerHTML = "";
    
        let tabela = document.getElementById("productTable");
        let rows = tabela.querySelectorAll("tr:not(:first-child)");
    
        rows.forEach(row => {
            let card = document.createElement("div");
            card.classList.add("card");
                  
            card.innerHTML = `
                    <p>${row.cells[1].innerText}</p>
                    <p><strong>Código:</strong> ${row.cells[0].innerText}</p>
                    <p><strong>Quantidade:</strong> ${row.cells[2].innerText}</p>
                    <p><strong style="min-width: 50vw">Observação:</strong> 
                        <span contenteditable="true" class="editable-observacao">${row.cells[3].innerText}</span>
                    </p>
                    <img src="./trash-bin.png" class="btn-delete" style="cursor: pointer;">
                `;


    
            card.querySelector(".btn-delete").addEventListener("click", function () {
                let productName = row.cells[1].innerText;
                let quantity = row.cells[2].innerText;
    
                let index = itens.findIndex(item => item.produto === productName && item.qtd === quantity);
                if (index !== -1) {
                    itens.splice(index, 1);
                }
    
                row.remove();
                Renderizar_card();
            });
    
            cardsContainer.appendChild(card);
        });
    }
    
    
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

