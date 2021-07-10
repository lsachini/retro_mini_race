var DEBUG = false;

// Constants
var MAX_REFRESH = 15;
var MIN_REFRESH = 50;

var MAX_COIN_INTERVAL = 10000;
var MIN_COIN_INTERVAL = 5000;

var PLAYER_OFFSET = 10;
var OPPONENT_OFFSET = 5;
var REFRESH_KEYBOARD =  MIN_REFRESH;

var SCREEN_WIDTH = 480;
var SCREEN_HEIGHT = 320;

var TRACK_WIDTH = 240;

var LEFT_BOUND = 5;
var RIGHT_BOUND = TRACK_WIDTH - LEFT_BOUND;

var DURATION = 120;

var refresh = MIN_REFRESH;
var ACCELERATION = 10;

var CAR_HEIGHT = 75;
var CAR_WIDTH = 40;

var CAR_EXPLOSION_HEIGHT = 75;
var CAR_EXPLOSION_WIDTH = 40;

var JOYSTICK_SIZE = 100;

var FONT_SIZE = 10;

// Globals
var thinlib;
var player;
var opponent = [];
var track;
var infos;
var mainCallback;
var coinCallback;
var trackPosition;
var pauseCollision;
var collisionAudio;
var collision = false;
var coinSound;
var coinAnimation;
var counter = 0;
var speedState = { up: 0, down: 1, nothing: 2 };
var speedPressed = speedState.nothing;
var accelerationCounter= 0;
var playerImage;
var explosionImage;
var opponentImage;
var lockScreen;

var isMobile = (function() { return /Android|Mobile|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) })();

var orientationTest = { beta: 0 }; 

function changedOrientation(ev) {
    orientationTest.beta = ev.beta;
}

window.addEventListener('load', startGame, false);

function startGame() {
    
    var oMain, 
        parmInfos,
        parmTrack,
        actions,
        back,
        restart,
        seconds,
        lblSeconds,
        txtSeconds,
        score,
        lblScore,
        txtScore,
        speed, speedUp, speedDown, lblSpeed,
        parmPlayer,
        initialTop = 10,
        initialLeft = 10,
        nextLine = 90,
        doc = document;
    
    var parmAudio,
        parmCoinSound,
        parmMainScreen,
        mainScreen;

    ranking.getObject();

    options.loadValues();

    switch(options.getValue('playerColor')) {
        case 'black':
            playerImage = 'img/blackcar.png';
            explosionImage = 'img/blackexplosion.png';
            break;

        case 'blue':
            playerImage = 'img/bluecar.png';
            explosionImage = 'img/blueexplosion.png';
            break;

        case 'green':
            playerImage = 'img/greencar.png';
            explosionImage = 'img/greenexplosion.png';
            break;

        case 'orange':
            playerImage = 'img/orangecar.png';
            explosionImage = 'img/orangeexplosion.png';
            break;

        case 'yellow':
            playerImage = 'img/yellowcar.png';
            explosionImage = 'img/yellowexplosion.png';
            break;

        default:
            playerImage = 'img/redcar.png';
            explosionImage = 'img/redexplosion.png';
            break;

    }


    switch(options.getValue('opponentColor')) {
        case 'black':
            opponentImage = 'img/blackcar.png';
            break;

        case 'blue':
            opponentImage = 'img/bluecar.png';
            break;

        case 'orange':
            opponentImage = 'img/orangecar.png';
            break;

        case 'red':
            opponentImage = 'img/redcar.png';
            break;

        case 'yellow':
            opponentImage = 'img/yellowcar.png';
            break;

        default:
            opponentImage = 'img/greencar.png';
            break;

    }

    parmCoinSound = new Object();
    parmCoinSound.id = 'coinSound';
    parmCoinSound.src = 'sounds/coin.ogg';
    parmCoinSound.name = 'coinSound';
    coinSound = new Audio(parmCoinSound);    
    
    parmAudio = { id: 'collisionAudio',
                  name: 'collisiionAudio',
                  src: 'sounds/colisao.ogg' };
    collisionAudio = new Audio(parmAudio);

    oMain = doc.getElementById('main');
    thinlib = new ThinLib(oMain, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    parmInfos = { id: 'infos',
                  width: thinlib.getWidth(),
                  height: thinlib.getHeight(),
                  color: WHITE };

    infos = thinlib.addSprite(parmInfos);    

    trackPosition = -(160);
    
    parmTrack = { id: 'track',
                  width: TRACK_WIDTH,
                  height: SCREEN_HEIGHT,
                  left: SCREEN_WIDTH - TRACK_WIDTH - 40,
                  image: 'img/track.png',
                  color: WHITE,
                  backgroundPosition: '0px ' + trackPosition + 'px' };

    track = thinlib.addSprite(parmTrack);

    actions = doc.createElement('div');
    actions.style.left = initialLeft + 'px';
    actions.style.top = initialTop + 'px';
    actions.style.height = '50px';
    actions.style.position = 'absolute';

    back = doc.createElement('div');
    back.style.left = '10px';
    back.style.top = '10px';
    back.style.position = 'relative';   
    back.className = 'button button-small';
    back.innerHTML = 'Back';

    new FastButton(back, goBack, false, true); 

    actions.appendChild(back);

    restart = doc.createElement('div');
    restart.style.left = '10px';
    restart.style.top = '10px';
    restart.style.position = 'relative';   
    restart.className = 'button button-small';
    restart.innerHTML = 'Restart';

    new FastButton(restart, again, false, true);

    actions.appendChild(restart);

    thinlib.addElement(actions, infos);

    seconds = doc.createElement('div');
    seconds.style.left = initialLeft + 'px';
    seconds.style.top = initialTop + nextLine + 'px';
    seconds.style.height = '50px';
    seconds.style.position = 'absolute';
    seconds.style.textAlign = 'left';
    
    lblSeconds = doc.createElement('div');
    lblSeconds.style.left = '10px';
    lblSeconds.style.top = '10px';
    lblSeconds.style.position = 'relative';
    lblSeconds.innerHTML = 'Seconds';

    seconds.appendChild(lblSeconds);
    
    txtSeconds = doc.createElement('div');
    txtSeconds.id = 'seconds';
    txtSeconds.style.left = '10px';
    txtSeconds.style.top = '10px';
    txtSeconds.style.position = 'relative';
    txtSeconds.innerHTML = DURATION;
    
    seconds.appendChild(txtSeconds);    
    
    thinlib.addElement(seconds, infos);
    
    score = doc.createElement('div');
    score.style.left = (initialLeft) + 'px';
    score.style.top = (initialTop + 2 * nextLine) + 'px';
    score.style.height = '50px';
    score.style.position = 'absolute';    
    score.style.textAlign = 'left';
    
    lblScore = doc.createElement('div');
    lblScore.style.left = '10px';
    lblScore.style.top = '10px';
    lblScore.style.position = 'relative';
    lblScore.innerHTML = 'Score';
    
    score.appendChild(lblScore);
    
    txtScore = doc.createElement('div');
    txtScore.id = 'score';
    txtScore.style.left = '10px';
    txtScore.style.top = '10px';
    txtScore.style.position = 'relative';
    txtScore.innerHTML = 0;
    
    score.appendChild(txtScore);
    
    thinlib.addElement(score, infos);  
 
    parmPlayer = { image: playerImage,
                   name: 'player',
                   width: CAR_WIDTH,
                   height: CAR_HEIGHT,
                   frames: 4,
                   refresh: 100,
                   left: 50,
                   top: track.offsetHeight - CAR_HEIGHT - 20 };
    
    player = thinlib.newAnimation(parmPlayer);    
     
    thinlib.addElement(player, track);
    
    thinlib.captureKeys();    

    newCoin();
    newOpponent();
    
    startCallbacks();    
    createCoinCallback(); 

    window.addEventListener('deviceorientation', changedOrientation, false );
}

function newCoin() {
  var left = parseInt(Math.random() * 121 + 18, 10);
  var parameters = new Object();
  
  parameters = { image: 'img/coin5.png',
                 name: 'coin',
                 id: 'coin',
                 frames: 1,
                 width: 24,
                 height: 24,
                 left: left,
                 top: -24 };
  
  coinAnimation = thinlib.newAnimation(parameters);

  var node = coinAnimation.getDOM();
    
  node.collision = false;
  node.move = false;
  node.score = 5;

  thinlib.addElement(node, track);
}

function resetOpponents() { 
    var opponents,
        curOpponent,
        prevOpponent,
        straight,
        elements,
        element,
        i,
        signal,
        left,
        offset,
        len,
        doc = document;
    
    opponents = doc.getElementsByName('opponent');    
    
    if (opponents.length === 0) {
        opponents = findObjects('opponent');
    }
    
    straight = Math.random() * 100 > 70 ? true : false;

    len = opponents.length;
    for (i = len; i;) {
        curOpponent = opponents[--i];
 
        curOpponent.style.top = -(CAR_HEIGHT) + 'px';
        curOpponent.orientation = Math.random() * 100 > 50 ? 'left' : 'right';
        curOpponent.straight = straight;
        curOpponent.collision = false;
        curOpponent.side = Math.random() * 50 + 150;

        if (prevOpponent) {
            if (straight) {
                do {
                    signal = Math.random() * 100 > 50 ? 1 : -1;
                    offset = parseInt(Math.random() * 150 , 10);
                    left = prevOpponent.offsetLeft + signal * offset + signal * CAR_WIDTH;
                } while (left > RIGHT_BOUND - CAR_WIDTH || left < LEFT_BOUND)
                
                curOpponent.move = (Math.random() * 100 + 1) > 50 ? true : false; 
                curOpponent.style.left = left + 'px';
            } 
            else {
                curOpponent.move = false; 
            }
        }
        else {
            left = parseInt(Math.random() * 121 + 18, 10);
       
            curOpponent.move = true;
            curOpponent.style.left = left + 'px';
        }

        prevOpponent = curOpponent;
    }
}

function resetCoin() {
    var coin = document.getElementById('coin');
    var left = parseInt(Math.random() * 121 + 18, 10);    

    coin.style.left = left + 'px';
    coin.style.top = '-24px';
    coin.collision = false;
    coin.move = false;
}

function createCoinCallback() {
    var nextCall = Math.random() * MAX_COIN_INTERVAL;
    
    nextCall = nextCall < MIN_COIN_INTERVAL ? MIN_COIN_INTERVAL : nextCall;
    resetCoin();
    
    coinCallback = setTimeout( function() { 
        var coin = document.getElementById('coin');
        var nextCoin = parseInt(Math.random() * 5 + 1);
        var parameters = { image: 'img/coin5.png',
                 frames: 1,
                 refresh: 1,
                 repeat: false,
                 width: 24,
                 height: 24,
                 left: coin.offsetLeft,
                 top: coin.offsetTop };

        switch(nextCoin) {
            case 1:
                coin.score = 5;
                break;

            case 2:
                parameters.image = 'img/coin2.png';
                coin.score = 2;
                break;

            default:
                parameters.image = 'img/coin1.png';
                coin.score = 1;
                break;
        }
        
        coinAnimation.setAnimation(parameters);

        coin.move = true; 
    }, nextCall );    
}

function again() {
    var parmPlayer,
        doc = document;

    stopCallbacks();
    clearTimeout(coinCallback);    

    removeAllObjects();
    
    refresh = MIN_REFRESH;

    doc.getElementById('seconds').innerHTML = DURATION;
    doc.getElementById('score').innerHTML = '0';
        
    parmPlayer = { image: playerImage,
                   name: 'player',
                   width: CAR_WIDTH,
                   height: CAR_HEIGHT,
                   frames: 4,
                   refresh: 100,
                   left: 50,
                   top: track.offsetHeight - CAR_HEIGHT - 20 };        

    player.setAnimation(parmPlayer);
    
    newOpponent();
    newCoin();

    collision = false;

    createCoinCallback();       
    startCallbacks();        
}

function callback(ev) {
    var keyPress = thinlib.getKeyPress(),
        oldRefresh = refresh,
        left = 37,  
        right = 39, 
        speedUp = 81,
        speedDown = 87,
        playerOffset = PLAYER_OFFSET,
        joystickPressed,
        nextpos,
        playerDOM,
        playerStyle;
        
    counter += refresh;
    
    if (counter > 1000) {
		counter = 0;

        if(timeCounter()) {
            return;
        }
    }

    if (collision) {
        return;
    }

    if (refresh != MAX_REFRESH) {
        accelerationCounter += refresh;

        if (accelerationCounter > 3000) {
            accelerationCounter = 0;
            refresh -= ACCELERATION;
            
            if (refresh < MAX_REFRESH) {
                refresh = MAX_REFRESH;
            }

            thinlib.clearCallback(mainCallback);
            mainCallback = thinlib.setCallback(callback, refresh);
        }
    }        

    playerDOM = player.getDOM();
    playerStyle = playerDOM.style;
    
    rollTrack();

    if (!keyPress && !orientationTest && !speedPressed) {
        return;
    }

    if (!keyPress && orientationTest) {
        if (orientationTest.beta > 30 || 
            orientationTest.beta < -30) {
            playerOffset = 10;
        }
        else if (orientationTest.beta > 10 || 
                  orientationTest.beta < -10) {
            playerOffset = 5;
        }
        else if (orientationTest.beta > 5 || 
                  orientationTest.beta < -5) {
            playerOffset = 1;
        }
        else {
            playerOffset = 0;
        }
    }

    if (keyPress == left || orientationTest.beta > 6) { 
        nextpos = playerDOM.offsetLeft - playerOffset;
            
        if (nextpos > LEFT_BOUND) {
            playerStyle.left = nextpos + 'px';
        }
        else {
            playerStyle.left = LEFT_BOUND + 'px';
        }
    }
    else if (keyPress == right || orientationTest.beta < -6) { 
        nextpos = playerDOM.offsetLeft + playerOffset;
            
        if (nextpos < RIGHT_BOUND - playerDOM.offsetWidth) {
            playerStyle.left = nextpos + 'px';
        }
        else {
            playerStyle.left = RIGHT_BOUND - playerDOM.offsetWidth + 'px';
        }
    }
 
    moveObjects();
}

function rollTrack(){
    trackPosition = trackPosition + 15;
    
    if (trackPosition >= 0) {
        trackPosition = -(160);
    }
    
    track.style.backgroundPosition = '0px ' + trackPosition + 'px';
}

function newOpponent() {
    var left,
        parameters,
        node, 
        i;
  
    for (i = 0; i < 2; i++) {
        left = parseInt(Math.random() * 121 + 18, 10);
  
        parameters = { image: opponentImage,
                       name: 'opponent',
                       frames: 4,
                       refresh: 100,
                       width: CAR_WIDTH,
                       height: CAR_HEIGHT,
                       left: left,
                       top: -CAR_HEIGHT };
  
        opponent[i] = thinlib.newAnimation(parameters);
        node = opponent[i].getDOM();
    
        node.orientation = Math.random() * 100 > 50 ? 'left' : 'right'    ;
        node.straight = Math.random() * 100 > 70 ? true : false    ;
        node.collision = false;
        node.side = Math.random() * 50 + 180;
        node.move = i == 0 ? true : false;

        thinlib.addElement(node, track);
    }    
}

function moveObjects() {
    var opponents,
        curOpponent,
        coin,
        fakeOpponent,
        newLeft,
        newTop,
        elements,
        element,
        i,
        len,
        deltaX,
        deltaY,
        tangent, 
        radian,
        list1,
        list2,
        parmPlayer,
        score,
        offsetLeft,
        doc = document,
        playerDOM;
    
    opponents = doc.getElementsByName('opponent');
    coin = document.getElementById('coin');
    
    playerDOM = player.getDOM();
    
    if (opponents.length === 0) {
        opponents = findObjects('opponent');
    }
    
    len = opponents.length;
    for (i = len; i;) {
        curOpponent = opponents[--i];

        if (!curOpponent.move) {
            continue;
        }
        
        offsetLeft = curOpponent.offsetLeft;
        
        if (curOpponent.straight) {
            deltaX = 0;
            deltaY = OPPONENT_OFFSET;
        }
        else {
            tangent = curOpponent.side / 100;
            radian = Math.abs(Math.atan(tangent))
            
            deltaY = parseInt(Math.abs(Math.sin(radian) * OPPONENT_OFFSET), 10);
            deltaX = parseInt(Math.abs(Math.cos(radian) * OPPONENT_OFFSET), 10);
        }
        
        if (curOpponent.orientation === 'left') {
            deltaX = offsetLeft - deltaX > LEFT_BOUND ? deltaX : offsetLeft - LEFT_BOUND;
            
            newLeft = offsetLeft - deltaX;
            
            if (offsetLeft <= LEFT_BOUND) {
                curOpponent.orientation = 'right';
            }
        }
        else {
            deltaX = offsetLeft + deltaX < RIGHT_BOUND - CAR_WIDTH ? deltaX : RIGHT_BOUND - CAR_WIDTH - offsetLeft;
            
            newLeft = offsetLeft + deltaX;
            
            if (offsetLeft >= RIGHT_BOUND - CAR_WIDTH) {
                curOpponent.orientation = 'left';
            }
        }
        
        newTop = curOpponent.offsetTop + deltaY;
        
        list1 = [];
        list2 = [];
        
        fakeOpponent = { offsetLeft: newLeft,
                         offsetTop: newTop,
                         offsetHeight: CAR_HEIGHT,
                         offsetWidth: CAR_WIDTH };
        
        list1[0] = playerDOM;
        list2[0] = fakeOpponent;
        
        if (thinlib.collision(list1, list2)) {
            curOpponent.collision = true;
        }
        
        if (curOpponent.collision === true) {
            curOpponent.style.left = newLeft + 'px';
            curOpponent.style.top = newTop + 'px';            
            
            if (options.getValue('sounds') != 'no') {
                collisionAudio.play();
            }
            
            parmPlayer = { image: explosionImage,
                           name: 'player',
                           width: CAR_EXPLOSION_WIDTH,
                           height: CAR_EXPLOSION_HEIGHT,
                           frames: 1,
                           refresh: 1,
                           repeat: false,
                           top: playerDOM.offsetTop,
                           left: playerDOM.offsetLeft };
            
            player.setAnimation(parmPlayer);
            opponent[0].stopAnimation();
            opponent[1].stopAnimation();
            
            //thinlib.clearCallback(mainCallback);
            collision = true;
            clearTimeout(coinCallback);
            
            pauseCollision = setTimeout(continueGame, 4000);
            
            return;
        }
        else {
            if (newTop > track.offsetHeight) {
                var score = parseInt(doc.getElementById('score').innerHTML, 10);

                doc.getElementById('score').innerHTML = ++score;
        
                resetOpponents();
                
                return;
            }
            else {
                curOpponent.style.left = newLeft + 'px';
                curOpponent.style.top = newTop + 'px';
            }
        }
    }  

      if(coin.move == false) {
            return;
    }
        
    coin.style.top = (coin.offsetTop + 5) + 'px';
        
    var list1 = new Array();
    var list2 = new Array();
        
    list1[0] = player.getDOM();
    list2[0] = coin;
        
    if (thinlib.collision(list1, list2)) {
        coin.collision = true;
    }
        
    if (coin.collision == true) {
        if (options.getValue('sounds') != 'no') {
            coinSound.play();
        }
        
        var score = parseInt(document.getElementById('score').innerHTML, 10);
                
        document.getElementById('score').innerHTML = score + coin.score	;

        clearTimeout(coinCallback);
                
       createCoinCallback();            
    }
    else {
        if (coin.offsetTop > track.offsetHeight) {
            clearTimeout(coinCallback);    
          createCoinCallback();
        }
    }    
}

function continueGame() {
    var playerDOM = player.getDOM(),
        parmPlayer;
                
    resetOpponents();

    refresh = REFRESH_KEYBOARD;                

    collision = false;

    thinlib.clearCallback(mainCallback);
    mainCallback = thinlib.setCallback(callback, refresh);    
    createCoinCallback();        
                
    parmPlayer = { image: playerImage,
                   name: 'player',
                   width: CAR_WIDTH,
                   height: CAR_HEIGHT,
                   frames: 4,
                   refresh: 100,
                   top: playerDOM.offsetTop,
                   left: playerDOM.offsetLeft };
                
    player.setAnimation(parmPlayer);
    opponent[0].startAnimation();
    opponent[1].startAnimation();
}

function timeCounter() {
    var doc = document,
        time; 
    
    counter = 0;
    
    time = parseInt(doc.getElementById('seconds').innerHTML, 10);
    
    time--;

    doc.getElementById('seconds').innerHTML = time;
    
    if (time === 0) {
        player.stopAnimation();
        opponent[0].stopAnimation();
        opponent[1].stopAnimation();
        stopCallbacks();
        resetCoin();
        resetOpponents();
        clearTimeout(coinCallback);

        var totalScore = parseInt(doc.getElementById('score').innerHTML, 10);

        if (totalScore > 0 && ranking.isRanking(totalScore)) {
            dialog({ message: 'Congratulations! You are in the TOP 5 ranking', 
                       prompt: false,
                     buttonOk: function (args) {
                                   ranking.tryInsert(totalScore);                                
                               }
                   });
        }

        return true; 
    } 

    return false;
}

function removeAllObjects(){
    var opponents = document.getElementsByName('opponent');
    
    if (opponents.length === 0) {
        opponents = findObjects('opponent');
    }
    
    var len = opponents.length;

    for (i = len; i--;) {
        opponents[i].parentNode.removeChild(opponents[i]);
        opponents[i] = null;
    }   

    var coin = document.getElementById('coin');
    
    coin.parentNode.removeChild(coin);
    coin = null;     
}

function findObjects(name) {
    var opponents,
        elements, 
        element,
        i, 
        len;

    opponents = [];
    elements = document.getElementsByTagName('div');
    
    len = elements.length;
    for (i = len; i;) {
        element = elements[--i];
        
        if (element.name === name) {
            opponents[opponents.length] = element;
        }
    }
    
    return opponents;
}

function startCallbacks() {
    mainCallback = thinlib.setCallback(function () { callback(); }, REFRESH_KEYBOARD);    
    counter = 0;
}

function stopCallbacks() {
    thinlib.clearCallback(mainCallback);    
    clearTimeout(pauseCollision);
}

function goBack() {
  window.location.assign('main.html');
}

var ranking = new Ranking();
var options = new Options();

window.addEventListener('load',  
                        function() { 
                            if(window.navigator.requestWakeLock) {
                                lockScreen = window.navigator.requestWakeLock('screen');      
                            }
                        },
                        false);

window.addEventListener('unload', 
                        function() { 
                            if(lockScreen) {
                                lockScreen.unlock();      
                            }
                        },
                        false);
