const main = document.getElementsByTagName('main')[0];

let target = main.getElementsByClassName('link')[0];

// console.log(main)

// document.execCommand("insertHTML", false, text);

function convertToPlaintext() {
    let textContent = this.textContent;
    this.innerHTML = "";
    this.textContent = textContent;
}

let initTarget = function () {

    target.addEventListener('focus', (event) => {
        target.innerText = ''
    });

    target.addEventListener('input', convertToPlaintext, false);

    target.addEventListener('paste', (event) => {

        target.innerHTML = target.innerText;

        let paste = (event.clipboardData || window.clipboardData).getData('text');

        paste = paste + '';

        console.log(paste)

        if (paste.startsWith('https://') || paste.startsWith('http://')) {

        } else {
            target.innerText = '';
            return;
        }

        target.innerText = paste;

        target.blur();

        let node = document.createElement('div');
        node.classList.add('link');
        node.contentEditable = 'true';
        node.innerHTML = 'Insert link here';

        main.insertBefore(node, main.childNodes[0]);     // Append <li> to <ul> with id='myList'

        target.contentEditable = 'false';
        let dataTarget = target;
        target = node;

        initTarget();

        setTimeout(function () {

            const response = get('/url?url=' + paste);
            let responseJson =  JSON.parse(response)
            console.log(responseJson)
            dataTarget.innerHTML =
                '<a href="' + responseJson.url + '" target="_blank">' + responseJson.title + '</a>' +
                '<br/>Text: ' + responseJson.text +
                '<br/>Words: ' + responseJson.words.length;

        }, 0);


        // const data = response.data;



        // const selection = window.getSelection();
        //
        // if (!selection.rangeCount)
        //     return false;
        //
        // selection.deleteFromDocument();
        // selection.getRangeAt(0).insertNode(document.createTextNode(paste));
        // event.preventDefault();
    });
};

initTarget();



function get(theUrl) {

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
