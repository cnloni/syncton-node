var sync = require('syncton-node').create();
var resultStore = [];
for(var i=0;i<9;i++) {
	resultStore[i] = sync.todo((i%2?executer:waiter),i+1);
}
sync.todo(function(){
	console.log('All Results:');
	for(var i=0;i<resultStore.length;i++) {
		console.log(resultStore[i].get());
	}
});

function executer(counter,result) {
	var sync = this;
	console.log('executor: ' + counter);
	result.set('RESULT-'+counter);
	sync.finish();
}
function waiter(counter,result) {
	var sync = this;
	setTimeout(function(){
		console.log('waiter: ' + counter);
		result.set('RESULT-'+counter);
		sync.finish();
	},1000);
}
