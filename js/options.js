function Options() {
    var opponentColor,
        playerColor,
        sounds,
        util = new Util();
        storage = window.storage;
        
    if (!storage) {
        storage = window.localStorage;
    }
        
    // FunÃ§Ãµes pÃºblicas
    { // begin region
    function init() {
        var doc = document;
        
        loadValues();
        
        doc.getElementById('opponentColor').value = opponentColor;
        doc.getElementById('playerColor').value = playerColor;
        doc.getElementById('sounds').value = sounds;
        
        doc.getElementById('opponentColor').disabled = false;
        doc.getElementById('playerColor').disabled = false;
        doc.getElementById('sounds').disabled = false;
    }
    this.init = init;
    
    function loadValues() {
        var doc = document;
        
        opponentColor = storage.getItem('opponentColor');
        playerColor = storage.getItem('playerColor');
        sounds = storage.getItem('sounds');

        // + '' é necessário para conversão do tipo object, retornado
        // pelo JavaScriptInterface no Android, para string. Se não fizer isso
        // comparações com === e !== não funcionam (poderia ter sido utilizado
        // comparadores == ou !=, que também funcionaria)        
        opponentColor = opponentColor ? opponentColor + '' : 'red';
        playerColor = playerColor ? playerColor + '' : 'blue';
        sounds = sounds ? sounds + '' : 'yes';
    }
    this.loadValues = loadValues;
    
    function saveValues() {
        var doc = document;
        
        opponentColor = doc.getElementById('opponentColor').value; 
        playerColor = doc.getElementById('playerColor').value;
        sounds = doc.getElementById('sounds').value;

        if (playerColor === opponentColor) {
            dialog( { message: 'Player color and opponent color can\'t be equal.',
                      buttonOk: function() { return; } } );   
            
            return;
        }
        
        storage.setItem('opponentColor', opponentColor);
        storage.setItem('playerColor', playerColor);
        storage.setItem('sounds', sounds);
        
        back();
    }
    this.saveValues = saveValues;
    
    function getValue(name) {
        switch (name) {
            case 'opponentColor':
                return opponentColor;
                
            case 'playerColor':
                return playerColor;

            case 'sounds':
                return sounds;
                
            default:
                break;
        }
        
        return '';
    }
    this.getValue = getValue;
    
    function back() {
        window.location.assign('main.html');
    }
    this.back = back;
    } // end region
}

