const Tesseract  = require('tesseract.js')

var express = require('express')
var app     = express()

const fs          = require('fs')
const path        = require('path')
const querystring = require('querystring')
const url         = require('url')
const formidable  = require('formidable')
const port        = 8080

function makeid(x) {	
let text = "";
let possible = "0123456789"
for (let i = 0; i < x; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
return text
}

app.use(express.static(path.join(__dirname, '/')))

app.get('/', function (req, res) {
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
	res.write('<input type="file" name="filetoupload"><br><br>');
	res.write('<input type="submit">');
	res.write('</form>');
	res.end();

})

app.all('/fileupload', function (req, res) {

	res.writeHead(200,{'content-type':'text/html;charset=utf8'})

		let form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {

		let oldpath = files.filetoupload.path
		name = path.parse(files.filetoupload.name).name
		dotext = path.parse(files.filetoupload.name).ext
		newpath = makeid(20)

	    fs.renameSync(oldpath, __dirname + "/" + newpath + dotext )

	    res.end(`
	    File "${files.filetoupload.name}${dotext}" uploaded and moved!<br>
	    <pre id="loading">loading...</pre>
	    <script>

		    var xhr = new XMLHttpRequest()
			xhr.open("GET", "ocr?data=${newpath + dotext}")
			xhr.onload = function() {
			
				if (xhr.readyState == 4 && xhr.status === 200) {
			
					// console.log(xhr.response)

					document.getElementById("loading").textContent = xhr.response

				}
			}
			xhr.send()

	    </script>
	    `)

	})

})

app.get('/ocr', function (req, res) {

	res.writeHead(200,{'content-type':'text/plain;charset=utf8'})

	let op = querystring.parse(url.parse(req.url).query)
	
	try{

	Tesseract.recognize(op.data)
	.then( result => {res.end(result.text);console.log("done!")} )

	}catch(e){
		
		res.end("ocr failed...")
	}

})

app.listen(port)

console.log(`Running at port ${port}`)