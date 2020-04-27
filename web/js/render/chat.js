let messages = [];

async function showChat() {

    // console.log('showChat')
    // console.log(this.path)
    if (this.path === '/chat') {
        updateChat().then()
        return;
    }

    document.getElementById('content-head').style.background = 'rgba(22, 185, 231, 0.1)'

    input.focus()
    clearContent()
    setPath('/chat');
    getMessages().then(messages => {
        this.messages = messages;
        // console.log(messages)
        for (let i = 0; i < messages.length; i++) {
            // console.log(messages[i].userid)
            // console.log(messages[i].text)
            setChatRow(messages[i])
        }
        // setText('<div class="row"><span>v0.4.3</span><span>23.04.2020</span></div>', 'info');
    });
}

async function updateChat() {

    console.log('updateChat')

    getMessages().then(messages => {
        this.messages = messages;
        for (let i = 0; i < messages.length; i++) {
            // console.log(messages[i].userid)
            if (!document.getElementById('chat-' + messages[i].id)) {
                // console.log('messages[i].id')
                setChatRow(messages[i])
            }
        }
    });
}

function setChatRow(message, className) {
    // console.log(message)
    let messageRow = document.createElement('div');
    messageRow.id = 'chat-' + message.id;
    messageRow.classList.add('message')
    messageRow.classList.add('noselect')
    contentList.prepend(messageRow)

    if (className)
        message.classList.add(className)

    const date = new Date(message.createdAt);

    const hours = date.getHours()
    const minutes = date.getMinutes()

        // .addEventListener('focusout', function (event) {

        // })

    messageRow.innerHTML = '<div>' +
        '<span class="username button simple text">' + message.userid.substring(0, 4) + ': </span>' +
        '<span class="">' + message.text + '</span>' +
        '</div>' +
        '<div>' +
        '<span onmousedown="deleteMessage()" class="button delete-message">✕</span>' +
        '<span class="text">' + (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + '</span>' +
        '</div>';
}

function deleteMessage() {
    showChat().then();
    // event.stopPropagation()
}
