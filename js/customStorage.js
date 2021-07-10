function CustomStorage() {
	var currentValue = '';

	function setItem(key, val) {
		window.external.notify('CustomStorage|setItem|' + key + '|' + val);
	}
	this.setItem = setItem;

	function getItem(key) {
		window.external.notify('CustomStorage|getItem|' + key);

		return currentValue;
	}
	this.getItem = getItem;

	function removeItem(key) {
		window.external.notify('CustomStorage|removeItem|' + key);
	}
	this.removeItem = removeItem;

	function process(val) {
		currentValue = val;
	}
	this.process = process;
}