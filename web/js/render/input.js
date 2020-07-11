let input = document.getElementById('content-input');
let email = document.getElementById('email');


function initInput() {

    input.id = 'content-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = 'Message';
    // content.innerHTML = '<input id="content-input" autocomplete="off" placeholder="Link, message or search"/>';
    // let input = document.getElementById('content-input');

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
                    updateChat().then();
                })
        }
    });

    input.addEventListener('focusin', function (event) {
        showChat().then();
        document.getElementById('content-head').classList.remove('active');
    })

    input.addEventListener('focusout', function (event) {

        // console.log(event)
        //
        // setPath('/');
        // clearContent();
        // initServiceInfo();
    })

    // graph.addEventListener('onclick', function (event) {
    //     setPath('/');
    //     clearContent();
    //     initServiceInfo();
    // })

    email.addEventListener('focusin', function (event) {
        email.textContent = ''
        email.style.textAlign = 'left'
    })
}
