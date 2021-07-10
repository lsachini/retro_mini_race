var WHITE = '#FFFFFF';
var BLACK = '#000000';
var RED = '#FF0000';
var GREEN = '#00FF00';
var BLUE = '#0000FF';

function ThinLib(oPlayground, iWidth, iHeight) {
    var playground = oPlayground,
        width = iWidth ? iWidth : window.screen.width,
        height = iHeight ? iHeight : window.screen.height,
        sprites = 0,
        keyPress = null;
  
    this.getPlayground = function() {
        return playground;
    }
  
    this.getWidth = function() {
        return width;
    }
  
    this.getHeight = function() {
        return height;
    }

    this.setCallback = function(func, iRefresh) {
        return setInterval(func, iRefresh);
    }

    this.clearCallback = function(callback) {
       clearInterval(callback);
    }
    

    this.addSprite = function(parameters) {
        try {
            var oSprite,
			    tempStyle;
    
            oSprite = createElement('DIV', '');
    
            oSprite.innerHTML = '&nbsp;';
            oSprite.id = parameters.id;
            
			tempStyle = oSprite.style;
			
			tempStyle.width = parameters.width + 'px';
            tempStyle.height = parameters.height + 'px';
            tempStyle.position = 'absolute';
    
            if (parameters.image) {
                tempStyle.backgroundImage = 'url(' + parameters.image + ')';
                tempStyle.backgroundRepeat = 'no-repeat';
            }
    
            tempStyle.backgroundColor = parameters.color ? parameters.color : WHITE;
            tempStyle.backgroundPosition = parameters.backgroundPosition ? parameters.backgroundPosition : '0px 0px';
            tempStyle.zIndex = sprites++;
            tempStyle.left = parameters.left ? parameters.left + 'px' : 0;
            tempStyle.top = parameters.top ? parameters.top + 'px' : 0;
            tempStyle.overflow = 'hidden';
    
            playground.appendChild(oSprite);
    
            return oSprite;
        } 
        catch (ex) {
            alert(ex.message);
        }
    }
  
    this.removeSprite = function(oSprite)
    {
        try {
            playground.removeChild(oSprite);  
        }
        catch (e) { }
    }
 
    this.addElement = function(oElement, oSprite) {
        var oNode;
  
        if (oElement instanceof Animation) {
            oNode = oElement.getDOM();
        }
        else {
            oNode = oElement;
        }
  
        oSprite.appendChild(oNode);
    } 
  
    this.removeElement = function(oElement, oSprite) {
        try {
            oSprite.removeChild(oElement);
        }
        catch (ex) { }
    }
  
    this.newAnimation = function(parameters) {
        var oAnimation = new Animation(parameters);
  
        oAnimation.updateDOM();
    
        return oAnimation;
    }
  
    this.disposeAnimation = function(oAnimation) {
        oAnimation.dispose();
    }  
  
    this.captureKeys = function() {
        document.onkeydown = function(e){
            _keyDown(window.event || e)
        };
        document.onkeyup = function(e){
            _keyUp(window.event || e)
        };
    }  
  
    this.getKeyPress = function () {
        return keyPress;
    }

    this.setKeyPress = function (code) {
        keyPress = code;
    }
  
    this.clearKeyPress = function() {
        keyPress = null;
    }
  
    this.collision = function(list1, list2, callback)  {
        var collision = true,
            retCollision = false,
            objA,
            objB,    
            element1,
            element2,			
            i,
            j;

        for (i = 0; i < list1.length; i++){
            element1 = list1[i];

            for(j = 0; j < list2.length; j++) {
			    element2 = list2[j];
			
                objA = { pontoX1: element1.offsetLeft,
                         pontoX2: element1.offsetLeft + element1.offsetWidth,
                         pontoY1: element1.offsetTop,
                         pontoY2: element1.offsetTop + element1.offsetHeight };

                objB = { pontoX1: element2.offsetLeft,
                         pontoX2: element2.offsetLeft + element2.offsetWidth,
                         pontoY1: element2.offsetTop,
                         pontoY2: element2.offsetTop + element2.offsetHeight };

                if (objA.pontoX2 < objB.pontoX1) {
                    collision = false;
                }

                if (objA.pontoX1 > objB.pontoX2) {
                    collision = false;
                }

                if (objA.pontoY2 < objB.pontoY1) {
                    collision = false;          
                }

                if (objA.pontoY1 > objB.pontoY2) {
                    collision = false;          
                }

                if (collision) {
                    retCollision = true;
                }

                if(collision && callback) {
                    callback(element1, element2);
                }
            }
        }
    
        return retCollision;
    }
  
    function _keyDown(ev) {
        keyPress = ev.keyCode ? ev.keyCode : ev.which ? ev.which : ev.charCode;
    }

    function _keyUp() {  
        keyPress = null;
    }
}  

function createElement(type, name){
    try {
        return document.createElement('<' + type + ' NAME="' + name + '">');
    }
    catch(e){
        return document.createElement(type);
    }
}

function $(sId) {
    return document.getElementById(sId);
}

function Audio(parameters) {
    var audio,
        audioClone,
        loop,
        choice;
		
	audio = createElement('AUDIO', parameters.name);
    audio.name = parameters.name;
    audio.id = parameters.id ? parameters.id : parameters.name + parseInt(Math.random() * 1000, 10);
    audio.src = parameters.src;
    audio.adjust = parameters.adjust ? parameters.adjust : 0;

    audioClone = createElement('AUDIO', parameters.name);
    audioClone.name = audio.name;
    audioClone.id = audio.id + 'clone';
    audioClone.src = audio.src;
    audioClone.adjust = audio.adjust;
  
    choice = true;
  
    this.play = function() {
        try {
            audio.loop = false;
            audio.play();
        } catch (e) {};
    }
  
    this.playLoop = playLoop;
    function playLoop() {
        try {
            audio.loop = true;
            audio.play();      
        } catch(e) {};
    }  
  
    this.pause = function() {
        try {
            audio.pause();
        } catch(e) {};
    }  
  
    this.stop = function() {
        try {
            audio.currentTime = 0;
            audio.pause();    
        } catch(e) {};
    }  
  
    this.getDOM = function() {
        return audio;
    }
}

function Animation(parameters) {
    var image = parameters.image,
        name = parameters.name,
        id = parameters.id ? parameters.id : parameters.name + parseInt(Math.random() * 1000, 10),
        width = parameters.width,
        height = parameters.height,
        frames = parameters.frames,
        refresh = parameters.refresh ? parameters.refresh : 100,
        frame = 0,
        left = parameters.left ? parameters.left : 0,
        top = parameters.top ? parameters.top : 0,
        vertical = parameters.vertical ? parameters.vertical : false,
        repeat = parameters.repeat ? parameters.repeat : true,
        oDiv = createElement('DIV', name);

    this.setAnimation = function (parameters) {
        //if (refresh > 1) {
            clearInterval(interval);
        //}
  
        image = parameters.image;
        width = parameters.width;
        height = parameters.height;
        frames = parameters.frames;
        refresh = parameters.refresh;
        frame = 0;
        left = parameters.left ? parameters.left : 0;
        top = parameters.top ? parameters.top : 0;  
        vertical = parameters.vertical ? parameters.vertical : false;
        repeat = parameters.repeat ? parameters.repeat : true;

        this.updateDOM();

        if (refresh > 1) 
        {
            interval = setInterval(refreshAnimation, refresh);
        }
        else 
        {
            refreshAnimation();
        }
    }   

    this.startAnimation = function() {
        if (refresh > 1) 
        {
            interval = setInterval(refreshAnimation, refresh);
        }
    }

    this.stopAnimation = function() {
        clearInterval(interval);        
    }
  
    this.dispose = function() {
        clearInterval(interval);
    }

    this.updateDOM = function() {
	    var tempStyle = oDiv.style;
	
        oDiv.innerHTML = '&nbsp;';
		
        tempStyle.position = 'absolute';
        tempStyle.backgroundImage = 'url(\'' + image + '\')';
        tempStyle.backgroundRepeat = 'no-repeat';
        tempStyle.width = width + 'px';
        tempStyle.height = height + 'px';
        tempStyle.top = top + 'px';
        tempStyle.left = left + 'px';  
        tempStyle.display = 'block';
        tempStyle.overflow = 'visible';
		
        oDiv.name = name;
        oDiv.id = id;
        oDiv.setAttribute('id', id);
        oDiv.setAttribute('name', name);
    }

    this.updateDOM();
  
    var interval = refresh > 1 ? setInterval(refreshAnimation, refresh) : 0;

    this.getDOM = function() {
        return oDiv;
    }
  
    function refreshAnimation() {
        frame++;  

        if(frame >= frames) {
            if(!repeat) {
                clearInterval(interval);
                oDiv.parentNode.removeChild(oDiv);  
    
                oDiv = null;
    
                return;
            }
            frame = 0;
        }

        if (vertical) {
            oDiv.style.background = 'url(' + image + ') no-repeat ' + '0px -' + (frame * height) + 'px';
        }
        else {
            oDiv.style.background = 'url(' + image + ') no-repeat ' + '-' + (frame * width) + 'px 0px';
        }   
    }
} 
  
