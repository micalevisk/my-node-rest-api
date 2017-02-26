///////////////////////////////// [ PROTOTYPES ] ////////////////////////////////
Array.prototype.contains = function (needle) {
	for (i in this)
		if(this[i] == needle) return true
	return false
}
String.prototype.isEmpty = function ()    { return !this.trim() ; }
String.prototype.asBold  = function ()    { return `<b>${this}</b>` ; }
String.prototype.asItalic= function ()    { return `<i>${this}</i>` ; }
String.prototype.asCode  = function ()    { return `<code>${this}</code>` ; }
String.prototype.asStrong= function ()    { return `<strong>${this}</strong>` ; }
String.prototype.asLink  = function (ref) { return `<a href="${ref}">${this}</a>` ; }
Number.prototype.notValid= function ()    { return !settings.chat_validos.contains(String(this)) ; }

module.exports = {

	// Return the second value if the first null, undefined ou não possuir alguma propriedade
	chooseValid: function(obj1, obj2) {
		if(!obj1 || typeof obj1 === 'undefined') return obj2
		return (Object.keys(obj1).length) ? obj1 : obj2;
	},

	// Return 'true' if value is valid object / not null or undefined data
	isValid: function(obj) {
		if(typeof obj === 'object' && (Object.keys(obj).length)) return true;
		return (obj!==null && typeof obj !== 'undefined');
	},

	// Return as numeric value
	toNumber: function(obj) {
		let number = Number(obj);
		if(number === Number(number)) return number;
		return null;
	},

	// Return unique object from arguments
	concatObjects: function(...args) {
		let obj = {};
		args.forEach((o) => Object.assign(obj, o));
		return obj;
	}

}