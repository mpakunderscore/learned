function initInput() {

    let input = document.getElementById('main-input');
    input.id = 'main-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = 'Link input, search or message';
    // content.innerHTML = '<input id="main-input" autocomplete="off" placeholder="Link, message or search"/>';
    // let input = document.getElementById('main-input');

    // console.log(input)
    // input.value = 'test';

    content.append(input)

    input.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            let value = input.value;
            // console.log(value)
            input.value = '';

            if (value.startsWith('http'))
                linkClick(value).then(() => {
                    renderMine(false).then()
                })
            else
                sendMessage(value).then(() => {
                    // renderMine(false).then()
                })
        }
    });

    input.addEventListener('focusin', function (event) {
        clearContent()
        showChat();
    })

    input.addEventListener('focusout', function (event) {
        clearContent()
        initServiceInfo();
    })
}

function showChat() {
    setText('@fox471: And second. You need to surf the edge and keep things going. Hey?')
    setText('@fox471: And second. You need to surf the edge and keep things going. Hey?')
    setText('@fox471: And second. You need to surf the edge and keep things going. Hey?')
    setText('@fox471: And second. You need to surf the edge and keep things going. Hey?')
}
