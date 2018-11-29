// http_qa_server.js

var http = require('http');
var spawn = require('child_process').spawn;

function handl(request, response){
	var chld = spawn('mediastreamvalidatorava', ['-t 10', '-O out_json', 'http://10.7.0.62:7777/source_1_hls.m3u8']);
	chld.stdout.setEncoding('utf8');
	
	chld.stdout.on('data', function (data) {
		var str = data.toString()
	
		console.log('DATAis ' + str);
	});
	
	chld.on('close', function (code) {
    console.log('process exit code ' + code);
	});
	
	chld.on('error', function (code) {
    console.log('ERROR');
	});
	
	chld.stderr.on('data', (data) => {
		console.error(`child stderr:\n${data}`);
	});

}

var app = http.createServer(handl);

app.listen(5000);
console.log('listening on port 5000...');