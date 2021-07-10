function Main() {
    var storage = window.storage;
    
    if (!storage) {
        storage = window.localStorage;
    } 

    // Funções Públicas
    { // begin region
    
    function startGame() {
        window.location.assign('game.html');
    }
    this.startGame = startGame;
    
    function goOptions() {
        window.location.assign('options.html');
    }
    this.goOptions = goOptions;

    function goRanking() {
        window.location.assign('ranking.html');
    }
    this.goRanking = goRanking; 
    } // end region
}

var main = new Main();
            
new FastButton(document.getElementById('btnPlay'), function () { main.startGame(); }, false, true);
new FastButton(document.getElementById('btnOptions'), function () { main.goOptions(); }, false, true);
new FastButton(document.getElementById('btnRanking'), function () { main.goRanking(); }, false, true);    
