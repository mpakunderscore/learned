function initServiceInfo() {

    contentList.innerHTML = '' +
        '<div>Last update: 02.03.2020</div>' +
        '<div>Version: 0.3.3</div>' +
        '<div>Close branch by x</div>' +
        '<div>Gray nodes only from current node</div>' +
        '<div class="info">Personal graph alpha 3</div>' +
        '<div>I don\'t like it at all</div>' +
        '<div>Where is colors</div>' +
        // '<div class="info">Link input work not properly</div>' +
        // '<div>Explore graph and <strike>interesting</strike> links</div>' +
        // '<div>Click on active node name to remove edges</div>' +
        // '<div>Click on link to save it in mine</div>' +
        // '<div>Move border</div>' +
        '';

    // TODO card design
    contentList.innerHTML += renderCard('インタラクションカードの例', 'セゴビアはマドリードからの日帰り観光地として人気がある（マドリードからは高速鉄道で30分）。旧市街は長く狭い高台の上に壮大に位置している。大聖堂、古代ローマの水道橋、美しいおとぎ話にでてきそうな古城（アルカサル）などの名所があり、眼下には田舎の景色が広がっている。カスティーリャと言われるこの辺りの景色は赤い大地という異名と合わせてファンタジーではよく用いられる。')
}
