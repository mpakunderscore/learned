function initServiceInfo() {

    contentList.innerHTML = '' +
        '<div>Last update: 04.03.2020</div>' +
        '<div>Version: 0.3.4</div>' +
        // '<div>Mobile stub</div>' +
        // '<div>Border design</div>' +
        '<div>Close branch by x fixed somehow</div>' +
        // '<div>Gray categories only from current node, test</div>' +
        '<div class="info">Personal graph, alpha 4</div>' +
        '<div>Where is colors</div>' +
        '';

    // TODO card design
    contentList.innerHTML += renderCard('インタラクションカードの例', 'セゴビアはマドリードからの日帰り観光地として人気がある（マドリードからは高速鉄道で30分）。旧市街は長く狭い高台の上に壮大に位置している。大聖堂、古代ローマの水道橋、美しいおとぎ話にでてきそうな古城（アルカサル）などの名所があり、眼下には田舎の景色が広がっている。カスティーリャと言われるこの辺りの景色は赤い大地という異名と合わせてファンタジーではよく用いられる。')
}
