function Ranking() {
    var list,
        SCORES_QTY = 5,
        storage = window.storage;

    if (!storage) {
        storage = window.localStorage;
    }
   
    function _saveJson() {
        var temp,
            len,
            i;
        
        if (list) {
            len = list.length;
        
            temp = '[';
        
            for (i = 0; i < len; i += 1) {
                temp += '{ "score": "' + list[i].score + '" },';
            }
        
            temp = temp.substr(0, temp.length - 1);
        
            temp += ']';
        
            storage.setItem("ranking", temp);
        }
    }

    function getObject() {
        var ret = storage.getItem("ranking");
        
        if (!ret) {
            list = [];
            
            return;
        }
        
        // ver comentário em options.js na função loadValues
        ret += '';
        
        list = JSON.parse(ret);
    }
    this.getObject = getObject;

    function _htmlEncoded(html) {
        return String(html).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');        
    }    

    function back() {
            window.location.assign('main.html');     
    }
    this.back = back;    
    
    function clean() {
        dialog({ message: util.getStringFromKey('cleanRanking'), 
            buttonOk: function (args) {
                          storage.removeItem('ranking');

                          populateTable();                          
                      },
            buttonCancel: function (args) { return; }
        });
    }
    this.clean = clean;
    
    function isRanking(score) {
        var len,
            i;
        
        if (!list) {
            return true;
        } else {
            len = list.length;
            
            if (len < SCORES_QTY) {
                return true;
            } else {
                for (i = 0; i < len; i += 1) {
                    if (score > list[i].score) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    this.isRanking = isRanking;
    
    function tryInsert(score) {
        var len,
            i,
            temp1 = null,
            temp2 = null,
            found = false;
            
        if (!list) {
            list = [];
        }
        
        len = list.length;

        for (i = 0; i < len; i += 1) {
            if (!temp1) {
                if (score > list[i].score) {
                    temp1 = list[i];
                    list[i] = { 'score': score };
                
                    found = true;
                }   
            } else {
                temp2 = list[i];
                list[i] = temp1;
                temp1 = temp2;
            }
        }
        
        if (len < SCORES_QTY) {
            if (found) {
                if (temp1) {
                    list[len] = temp1; 
                }   
            } else {
                list[len] = { 'score': score }; 
                          
                found = true;
            }
        }
        
        if (found) {
            _saveJson();
        }
        
        return found;
    }
    this.tryInsert = tryInsert;
    
    function populateTable() {
        var i,
            len,
            scores = document.getElementsByName('tdScore');

        getObject();            

        for (i = 0; i < scores.length; i += 1) {
            scores[i].innerHTML = '';
        }        
        
        if (!list) {
            return;
        }
        
        len = list.length;
        
        for (i = 0; i < len; i += 1) {
            scores[i].innerHTML = list[i].score;
        }
    }
    this.populateTable = populateTable;
}

var ranking = new Ranking();
var util = new Util();
        
new FastButton(document.getElementById('btnBack'), ranking.back, false, true);
new FastButton(document.getElementById('btnClean'), ranking.clean, false, true); 

window.addEventListener('load', function() { ranking.populateTable(); }, false);

