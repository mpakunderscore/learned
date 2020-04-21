function renderCard(title, text, img, color = 'green') {

    contentList.innerHTML +=
    '<div class="card" onclick="isMobile ? fullscreen() : this.style.display = \'none\'">' +
        '<div class="title">' +
            '<div class="circle ' + color +'"></div>' +
            '<div class="title-text">' + title + '</div>' +
        '</div>' +
        (text ? '<div class="text">' + text + '</div>' : '') +
    '</div>';
}

// function renderLinkGraph() {
//     console.log('renderLinkGraph')
// }

let filter = false;
let sorter;


function clickHome() {
    clearContent();
    initServiceInfo();
    renderText('You are back now')
}

function clearContent() {
    contentList.innerHTML = '';
}

