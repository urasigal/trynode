// http_qa_server.js

var http = require('http')
var spawn = require('child_process').spawn
var fs = require('fs')
var reqParse = require('url').parse

function handl (request, response) {
// Parese URL string.
  let queryString = reqParse(request.url).query + ''
  let urlParam = queryString.slice(queryString.indexOf('=') + 1)
  console.log('URL params are ' + urlParam)

  // Run validator as a command line.
  var chld = spawn('mediastreamvalidator', ['-t 10', '-O ./out_json', `${urlParam}`])
  chld.stdout.setEncoding('utf8')

  chld.stdout.on('data', (data) => {
  // var str = data.toString ()
  })

  // Triggered once the validator finished.
  chld.on('close', function (code) {
    console.log('process exit code ' + code)
    if (code === 0) {
      // Read valdator output from file.
      var content = fs.readFileSync('./out_json')
      response.writeHead(200)
      response.write(content)
      response.end()
    }
  })

  chld.on('error', function (code) {
    console.log('ERROR')
  })

  chld.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`)
  })

  chld.stderr.on('error', (data) => {
    console.error(`child stderr:\n${data}`)
  })
}

var app = http.createServer(handl)
app.listen(5000)
console.log('listening on port 5000...')
