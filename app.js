const Tesseract = require('tesseract.js')
const isImage   = require('is-image');
const http      = require('http')
const fs        = require('fs')
const port      = process.env.PORT

// lit le contenu du dossier courant, le nom de tous les fichers contenu dans ce dossier sont stockés de la tableau "files"

files = fs.readdirSync(__dirname)

// Tesseract retourne une promesse que l'on récupère avec "resolve()"

function mmk(x){

	return new Promise( resolve => {
		
		Tesseract.recognize(x)
		.then(function(result){
			resolve(result.text)
		})
		
	})

}

list = []

http.createServer(function (req, res) {
	
	res.writeHead(200,{'content-type': 'text/html;charset=utf-8'})

	if (req.url == '/'){
		
		for ( x of files){
		
			if ( isImage(x) ){
			
			console.log(x)
			list.push(mmk(x))
      
     			// pour chaque image, on récupère la promesse de Tesseract, dans le tableau "list"

			}
		
		}
		
		Promise.all(list).then(function(values) {
    
		// on attends que chaque promesses sont terminés avec "Promise.all()"
			
			for ( x of values ){
			res.write("<pre>"+x+"</pre><hr>")
			}
			res.end()
			
			// puis on affiche les résultats contenu dans le tableau "values"
			
		})
		
	}
  
}).listen(port)

console.log(`Running at port  ${port}`)
