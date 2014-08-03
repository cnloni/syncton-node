var syncton = require('../index');
syncton.todo(waiter,1000,0);
syncton.todoAsync(waiter,2000,1);
syncton.todoAsync(waiter,1500,2);
syncton.todoAsync(waiter,1000,3);
syncton.todoAsync(waiter,500,4);
syncton.todo(function(){
	console.log('END');
});

function waiter(interval,counter) {
	var sync = this;
	console.log('start: ' + counter + ',' + interval);
	setTimeout(function(){
		console.log('end: ' + counter);
		sync.finish();
	},interval);
}
