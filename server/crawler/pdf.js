const axios = require('axios');
let PDFParser = require('pdf2json');

let pdfParser = new PDFParser();

pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError) );
pdfParser.on('pdfParser_dataReady', pdfData => {
    console.log(JSON.stringify(pdfData));
});

async function downloadPDF() {
    const response = await axios.get(encodeURI('https://arxiv.org/pdf/1907.05774.pdf'));
    const data = response.data;
    console.log(data)
    // pdfParser.parseBuffer(data.pipe());
}

downloadPDF().then();
// pdfParser.loadPDF('../../file.pdf')


