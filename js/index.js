function go() {
    setTimeout(_hideSplash, 4000);

	//var lock = window.navigator.requestWakeLock('screen');

    function _hideSplash() {
        window.location.assign('main.html');
    }
}

window.addEventListener('load', go, false);
