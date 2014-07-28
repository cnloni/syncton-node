function ResultObject() {
}
ResultObject.prototype = {
	getValue: function() {
		return this.value;
	},
	setValue: function(value) {
		this.value = value;
	}
};
function Syncton(){
	this.queue = new Array();
	this.count = 0;
	this.interval = null;
}
Syncton.prototype.setInterval = function(interval) {
	this.interval = interval;
}
Syncton.prototype.todo = function() {
	var argArray = Array.prototype.slice.call(arguments); 
	var resultObject = new ResultObject();
	argArray.push(resultObject);
	if (this.count == 0) {
		this.start(argArray);
	} else {
		this.queue.push(argArray);
	}
	if (this.interval != null) {
		this.queue.push([waiter,this.interval]);
	}
	return resultObject;
}
Syncton.prototype.finish = function() {
	this.count--;
	if (this.queue.length > 0) {
		var a = this.queue.shift();
		this.start(a);
	}
}
Syncton.prototype.start = function(a) {
	this.count++;
	var fun = a.shift();
	fun.apply(this,a);
}
finisher=function(syncton) {
	syncton.finish();
}
waiter=function(interval) {
	setTimeout(finisher,interval,this);
}
module.exports = new Syncton();
 