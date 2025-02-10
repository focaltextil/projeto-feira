const fileUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQltJw9duOKFTUqUmDYl-6HXmen4KwDmfqiRZt3uPlcTe-za9WhIEGCYne248NrYHvfuYlIKfIvFaj-/pub?gid=0&single=true&output=csv";

async function loadExcelData() {
    try {
        const savedData = sessionStorage.getItem('base_produtos');
        if (savedData) {
            return JSON.parse(savedData);
        }

        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Erro ao baixar a planilha: ${response.statusText}`);
        }

        const csvData = await response.text();

        const rows = csvData
            .split('\n')
            .filter(row => row.trim() !== '')
            .map(row => {
                return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
                    .map(cell => cell.replace(/^"|"$/g, '').trim());
            });

        if (rows.length === 0) {
            throw new Error('O CSV está vazio ou os dados não foram carregados corretamente.');
        }

        const headers = rows.shift();
        const colunasDesejadas = ["ARTIGO", "COD"];
        const indicesColunas = colunasDesejadas.map(coluna => headers.indexOf(coluna)).filter(index => index !== -1);

        if (indicesColunas.length !== colunasDesejadas.length) {
            throw new Error('Nem todas as colunas desejadas foram encontradas no CSV.');
        }

        const jsonData = rows.map(row => {
            const item = {};
            colunasDesejadas.forEach((coluna, i) => {
                item[coluna] = row[indicesColunas[i]] ? row[indicesColunas[i]].replace(/\'/g, '') : '';
            });
            return item;
        });

        sessionStorage.setItem('base_produtos', JSON.stringify(jsonData));

        return jsonData;
    } catch (error) {
        console.error(`Erro ao carregar os dados: ${error.message}`);
        alert('Erro ao carregar os dados da planilha.');
        return [];
    }
}

loadExcelData()
    .then(jsonData => {
        console.log('Dados carregados:', jsonData);
    })
    .catch(error => {
        console.error('Erro durante a execução:', error);
    });
