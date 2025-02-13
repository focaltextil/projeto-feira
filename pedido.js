// TUDO RODA AQUI DENTRO

window.addEventListener("DOMContentLoaded", function () {

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
    let btn_abrir = document.getElementById("icone_add_produto");
    let modal = document.querySelector(".modal");

    const btn_pdf = document.getElementById("salvar_pdf");


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
            alert("Campo Produto e QTD não podem ser vazios");
            return;
        }
    
        let product = products.find(item => item.ARTIGO === productName);
        let productCode = product ? product.COD : "Desenvolver";
    
        let row = document.createElement("tr");
    
        let cellCode = document.createElement("td");
        cellCode.textContent = productCode;
    
        let cellProduct = document.createElement("td");
        cellProduct.textContent = productName;
    
        let cellQuantity = document.createElement("td");
        cellQuantity.textContent = quantity;
    
        let cellObservation = document.createElement("td");
        cellObservation.textContent = observation || "";
    
        row.appendChild(cellCode);
        row.appendChild(cellProduct);
        row.appendChild(cellQuantity);
        row.appendChild(cellObservation);
    
        productTable.appendChild(row);
    
       
        searchBox.value = "";
        quantityBox.value = "";
        obs.value = "";
    });


    function gerarPDF() {
        const { jsPDF } = window.jspdf;
        const elemento = document.querySelector("body");
    
        html2canvas(elemento).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
    
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save("pedido.pdf");
        });
    }
    
    btn_pdf.addEventListener("click", gerarPDF);
    
    
});


