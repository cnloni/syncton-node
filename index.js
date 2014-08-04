function Syncton(){
	this.queue = [];
	this.count = 0;
	this.acount = 0;
	this.interval = null;
}
Syncton.prototype.setInterval = function(interval) {
	this.interval = interval;
};
Syncton.prototype.todo = function() {
	var argArray = Array.prototype.slice.call(arguments); 
	var resultObject = {};
	//unset async flag
	argArray.unshift(false);
	argArray.push(resultObject);
	if (this.count == 0 && this.queue.length == 0) {
		this.start(argArray);
	} else {
		this.queue.push(argArray);
	}
	if (this.interval != null) {
		this.queue.push([false,waiter,this.interval]);
	}
	return resultObject;
};
Syncton.prototype.todoAsync = function() {
	var argArray = Array.prototype.slice.call(arguments); 
	var resultObject = {};
	//set async flag
	argArray.unshift(true);
	argArray.push(resultObject);
	if (this.count == this.acount && this.queue.length == 0) {
		this.start(argArray);
	} else {
		this.queue.push(argArray);
	}
	return resultObject;
};
Syncton.prototype.start = function(a) {
	var isasync = a.shift();
	var fun = a.shift();
	this.count++;
	if (isasync) {
		this.acount++;
	}
	fun.apply(this,a);
};
Syncton.prototype.finish = function() {
	this.count--;
	if (this.acount > 0) {
		this.acount--;
	}
	if (this.count == 0 && this.queue.length > 0) {
		var a = this.queue.shift();
		var isasync = a[0];
		this.start(a);
		if (isasync) {
			while(this.queue.length > 0 && this.queue[0][0]) {
				this.start(this.queue.shift());
			}
		}
	}
};
finisher=function(syncton) {
	syncton.finish();
};
waiter=function(interval) {
	setTimeout(finisher,interval,this);
};
module.exports.getInstance = function() {
	return new Syncton();
};

