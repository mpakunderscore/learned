function initServiceInfo() {

    contentList.innerHTML = '' +
        '<div>Last update: 06.03.2020</div>' +
        '<div>Version: 0.3.6</div>' +
        '<div>Delete mine link</div>' +
        // '<div>Link graph</div>' +
        // '<div><a href="/api">API</a> for link graph</div>' +
        '<div class="info">Personal graph under development</div>' +
        '<div>Where is design</div>' +
        '';

    // TODO card design
    contentList.innerHTML += renderCard('インタラクションカードの例', 'セゴビアはマドリードからの日帰り観光地として人気がある（マドリードからは高速鉄道で30分）。旧市街は長く狭い高台の上に壮大に位置している。大聖堂、古代ローマの水道橋、美しいおとぎ話にでてきそうな古城（アルカサル）などの名所があり、眼下には田舎の景色が広がっている。カスティーリャと言われるこの辺りの景色は赤い大地という異名と合わせてファンタジーではよく用いられる。')
}
