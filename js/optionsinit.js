var options = new Options();

window.addEventListener('load', function() { options.init(); }, false);

new FastButton(document.getElementById('btnSave'), options.saveValues, false, true); 
new FastButton(document.getElementById('btnBack'), options.back, false, true);
