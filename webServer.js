
//require the modules we need
var http = require('http'),
	path = require('path'),
	fs = require('fs'),

//this declares the file types we will support 
extensions = {
	".html" : "text/html",
	".css"	:"text/css",
	".js"	:"application/javascript",
	".png"	:"image/gif",
	".jpg"	:"image/jpeg"
};
//a helper function to handle file verification
function getFile(filePath,res,page404,mimeType){

	//asks if the requested file exists
	fs.exists(filePath, function(exists){

		//if it does...
		if(exists){


			//then read the file, run the anonymous function
			fs.readFile(filePath,function (err, contents){
				if(!err){

					//if there was no error
					//send the contents wit the default 200/ok header
					res.writeHead(200,{
						"Content-type"	: mimeType,
						"Content-Length"	: contents.length
					});

					res.end(contents);

				//for our own troubleshooting?
				} else {

					console.dir(err);
				};
			});
		} else {

			//if th erequested file was not found
			//serve-up our custom 404 page
			fs.readFile(page404,function(err,contents){

				//if there was no error
				if(!err){

					//send the contents with a 404/not found header
					res.writeHead(404, {'Content-type' : 'text/html' });
					res.end(contents);
				}else {

					//for our own troubleshooting
					console.dir(err);
				};
			});
		};
	});
};

//a helper function to handle HTTP requests
function requestHandler(req,res) {
	var fileName = path.basename(req.url) || 'test3.html',
		ext = path.extname(fileName),
		localFolder = __dirname + "\\",
		page404 = localFolder + '404.html';

		//do we support the requested file type?
		if(!extensions[ext]){

			res.writeHead(404,  {'Content-Type'	: 'text/html'});
			res.end("<html><head></head><body>The requested file type is not supported</body></html>");

		};

		//call our helper function
		//pass in th epath to the file we want
		//the response object, and the 404 page path
		//in case the requested file is not found
		getFile((localFolder + fileName),res,page404,extensions[ext]);
};

http.createServer(requestHandler)




.listen(8000);