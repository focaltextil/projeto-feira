window.addEventListener("DOMContentLoaded", function () {
    let cliente = sessionStorage.getItem("empresa");
    document.getElementById("cliente").innerHTML =`CLIENTE: ${cliente.toLocaleUpperCase()}` ;

    let cnpj = sessionStorage.getItem("cnpj");
    document.getElementById("cnpj").innerHTML = `CNPJ: ${cnpj}`;

    let contato = sessionStorage.getItem("contato");
    let fone = sessionStorage.getItem("fone");
    document.getElementById("contato").innerHTML = `CONTATO: ${contato.toLocaleUpperCase()} - FONE: ${fone}`;

    let rep = sessionStorage.getItem("representante");
    document.getElementById("representante").innerHTML = `REPRESENTANTE: ${rep.toLocaleUpperCase()}`;

    // ----------------------------------------------------------------------------------------
    // VARIAVEIS MUITO LOUCAS

    let products = JSON.parse(sessionStorage.getItem("base_produtos")) || [];
    let searchBox = document.getElementById("searchBox");
    let quantityBox = document.getElementById("quantityBox");
    let suggestions = document.getElementById("suggestions");
    let obs = document.getElementById("obs");
    let addBtn = document.getElementById("add-btn");
    let productTable = document.getElementById("productTable");
    let btn_fechar = document.getElementById("btn-fechar");
    let btn_abrir = document.getElementById("btn-abrir");
    let modal = document.querySelector(".modal");


    // ----------------------------------------------------------------------------------------
    // FUNCAO CABULOSA PRA MONTAR O PEDIDO
    
    function updateSuggestions(filter = "") {
        suggestions.innerHTML = "";

        let filterParts = filter.toLowerCase().split("%").filter(part => part.trim() !== "");

        let filtered = products
            .filter(item => filterParts.every(part => item.ARTIGO.toLowerCase().includes(part)));

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

    searchBox.addEventListener("input", (e) => {
        updateSuggestions(e.target.value);
    });

    document.addEventListener("click", (e) => {
        if (!searchBox.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = "none";
        }
    });


    btn_fechar.addEventListener("click", function(){

        modal.style.display = "none";

    });

    
    btn_abrir.addEventListener("click", function(){

        modal.style.display = "block";

    });

    addBtn.addEventListener("click", () => {
        let productName = searchBox.value.trim();
        let quantity = quantityBox.value.trim();
        let observation = obs.value.trim();
    
        if (productName === "" || quantity === "" || isNaN(quantity)) {
            alert("Seu orelhudo, o campo Produto ou QTD não podem ser vazios");
            return;
        }
    
        let product = products.find(item => item.ARTIGO === productName);
        let productCode = product ? product.COD : "N/A";
    
        let row = document.createElement("tr");
    
        let cellCode = document.createElement("td");
        cellCode.textContent = productCode;
    
        let cellProduct = document.createElement("td");
        cellProduct.textContent = productName;
    
        let cellQuantity = document.createElement("td");
        cellQuantity.textContent = quantity;
    
        let cellObservation = document.createElement("td");
        cellObservation.textContent = observation || "-";
    
        row.appendChild(cellCode);
        row.appendChild(cellProduct);
        row.appendChild(cellQuantity);
        row.appendChild(cellObservation);
    
        productTable.appendChild(row);
    
       
        searchBox.value = "";
        quantityBox.value = "";
        obs.value = "";
    });
    
});


