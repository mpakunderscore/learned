let messages = [];

async function showChat() {
    clearContent()
    setPath('/chat');
    getMessages().then(messages => {
        this.messages = messages;
        console.log(messages)
        for (let i = 0; i < messages.length; i++) {
            // console.log(messages[i].userid)
            // console.log(messages[i].text)
            setChatRow(messages[i])
        }
    });
}

async function updateChat() {
    getMessages().then(messages => {
        this.messages = messages;
        for (let i = 0; i < messages.length; i++) {
            // console.log(messages[i].userid)
            if (!document.getElementById('chat-' + messages[i].id)) {
                console.log('messages[i].id')
                setChatRow(messages[i])
            }
        }
    });
}

function setChatRow(message, className) {
    console.log(message)
    let messageRow = document.createElement('div');
    messageRow.id = 'chat-' + message.id;
    messageRow.classList.add('message')
    contentList.prepend(messageRow)

    if (className)
        message.classList.add(className)

    const date = new Date(message.createdAt);

    messageRow.innerHTML = '<div>' +
        '<span class="username">' + message.userid.substring(0, 4) + ': </span>' +
        '<span class="">' + message.text + '</span>' +
        '</div>' +
        '<div>' +
        '<span onclick="deleteMessage()" class="button delete-message">✕</span>' +
        '<span>' + date.getHours() + ':' + date.getMinutes() + '</span>' +
        '</div>';
}

function deleteMessage() {

}
