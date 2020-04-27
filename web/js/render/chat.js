function setText(text, className) {
    let message = document.createElement('div');
    message.classList.add('message')
    contentList.append(message)

    if (className)
        message.classList.add(className)
    
    message.innerHTML = text;
}

function renderText(text, next) {

    console.log(text)
    const timeout = 30;
    // const timeout = 0;

    // return;

    let message = document.createElement('div');
    contentList.append(message)

    // let iterator = 0;
    // let dotCount = 1;
    let i = 0;
    // let text = text

    let interval = setInterval(function () {

        // message.innerText = '.'.repeat(dotCount++)

        // if (dotCount >= 4)
        //     dotCount = 1;

        message.innerHTML = generatedWord(text, i);

        i++;

        if (i > text.length) {
            clearInterval(interval)
        }


        // console.log(i)

    }, timeout);
}

function generatedWord(text, i) {
    return text.substring(0, i);
}

function addLink (url, title) {
    let link = document.createElement('div');
    contentList.append(link)

    let a = document.createElement('a');
    a.href = url;
    a.innerText = title;
    a.target = '_blank';
    link.append(a);


    // link.innerText = title;
}
