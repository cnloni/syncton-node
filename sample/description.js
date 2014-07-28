/**
	サイトから用語の説明をダウンロードし、DBに格納する
*/
var http = require('http');
var cheerio = require('cheerio');
var sqlite3 = require('sqlite3');
var syncton = require('../lib/syncton');

var db = new sqlite3.Database("sqlite3/kimono.sqlite3");
var stmt = db.prepare("update word set type_id=?, yomi=?, description=?, code=? where id=?");

function download(row){
	var sync = this;
	var id  = row.id;
	var url = row.url;
	console.log(url);
	http.get(url,function(response) {
		var body = '';
		response.setEncoding('utf8');
		response.on('data', function(chunk){
			body += chunk;
		});
		response.on('end', function(){
			$ = cheerio.load(body);
			var title = $('head title').text();
			var divs = $('div.asset-body').children('div'); 
			var ps = divs.children('p');
			var yomi,desc,typeId,code;
			if (ps.length < 2 || ps[0].children.length == 0 || ps[1].children.length == 0) {
				console.log("Can not read");
				typeId = -1;
				code = divs.html();
			} else {
				var ryomi = ps[0].children[0].data;
				yomi  = ryomi.substr(4,ryomi.length-5);
				desc  = ps[1].children[0].data;
				typeId = 0;
			}
			stmt.run(typeId,yomi,desc,code,id,function(err){
				sync.finish();
			});
		});
	});
}

syncton.setInterval(100);
db.all(
	"select id,url from word where type_id is null",
	function(err,rows) {
		console.log("datasize = "+rows.length);
		for(var i=0;i<1000 && i<rows.length;i++) {
			syncton.todo(download,rows[i]);
		}
		syncton.todo(function(){stmt.finalize();db.close();this.finish();});
	}
);


