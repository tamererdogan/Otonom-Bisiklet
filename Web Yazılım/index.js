const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require("path");
const commandLine = require('shelljs');
const serialport = require('serialport');

//Port isimleri
var ports; 
//Bağlantı durumu
var baglantiDurumu = false;
//Seriport bağlantısı
var seriport;

function portListele(socket)
{
	//Bağlı olan portları bulmak
	ports = commandLine.exec("serialport-list -f json");
	ports = JSON.parse(ports.stdout);
	socket.emit("portlar", ports);	
	console.log("Yenilendi");
}

io.on('connection', function(socket){

	var url = socket.handshake.headers.referer;
	console.log(url);

	if (url == "http://localhost:8000/")
	{
		socket.on('baglantiDurumuNedir', function(){			
			socket.emit("baglantiDurumu", baglantiDurumu);	
		});

		portListele(socket);

		socket.on("baglan", function(portAdi){
			//Eğer daha önce bağlanılmamışsa
			if (!baglantiDurumu)
			{
				seriport = new serialport(portAdi, {
					baudRate:115200
				});		
				console.log("Seriport bağlantısı sağlandı. Port:"+portAdi);	
				baglantiDurumu = true;
				socket.emit("baglantiDurumu", baglantiDurumu);		
			}		
		});

		socket.on("baglantiyiKes", function(){
			//Eğer daha önce bağlanılmışsa
			if (baglantiDurumu)
			{
				seriport.close();
				console.log("Seriport bağlantısı kesildi.");
				baglantiDurumu = false;
				socket.emit("baglantiDurumu", baglantiDurumu);	
			}
		});

		socket.on("yenile", function(){
			portListele(socket);
		});	
	}

	if (url == "http://localhost:8000/yonlendir")
	{
		//Eğer D tuşana basıldıysa
		socket.on("aciArttir", function(){
			if (baglantiDurumu)
			{				
				seriport.write("d\n");
				console.log("Aci Arttir");
			}	
		});
		//Eğer A tuşana basıldıysa
		socket.on("aciAzalt", function(){
			if (baglantiDurumu)
			{
				seriport.write("a\n");
				console.log("Aci Azalt");
			}			
		});	
		//Eğer W tuşana basıldıysa
		socket.on("hizArttir", function(){
			if (baglantiDurumu)
			{
				seriport.write("w\n");
				console.log("Hiz Arttir");
			}			
		});	
		//Eğer S tuşana basıldıysa
		socket.on("hizAzalt", function(){
			if (baglantiDurumu)
			{
				seriport.write("s\n");
				console.log("Hiz Azalt");
			}				
		});
			    
	    seriport.on('data', function(data) {

	    	if(data[1] > 60)
	    	{
	    		var anlikAci = 256 - data[1];    		
	    		anlikAci = (anlikAci*(-1));
	    	}else
	    	{
	    		var anlikAci = data[1];  
	    	}

	    	if(data[2] > 60)
	    	{
	    		var hedefAci = 256 - data[2];    		
	    		hedefAci = (hedefAci*(-1));
	    	}else
	    	{
	    		var hedefAci = data[2];  
	    	}

	    	// if(data[2] > 60)
	    	// {
	    	// 	var hedefAci = 256 - data[2];    		
	    	// 	hedefAci = (hedefAci*(-1));
	    	// }else
	    	// {
	    	// 	var hedefAci = data[2];  
	    	// }

    		
    		// var anlikAci = data[1];
	    	// var hedefAci = data[2];		    	
	    	var pwm = data[0];    	
	    	var hata = data[3];
			console.log("1:"+pwm+" 2:"+anlikAci+" 3:"+hedefAci+" 4:"+hata);
	    	io.sockets.emit("htmlPwm", pwm);
	    	io.sockets.emit("htmlHedefAci", hedefAci);
	    	io.sockets.emit("htmlAnlikAci", anlikAci);
	    	io.sockets.emit("htmlHata", hata);
	    	//io.sockets.emit("htmlHedefHiz", data[0]); //Hız	
	    });	
	}
});

app.get('', function(req, res){
	app.use('/js', express.static(__dirname + '/js'));
	res.sendFile(path.join(__dirname+"/html/baglanti.html"));

});

app.get('/yonlendir', function(req, res){
	app.use('/js', express.static(__dirname + '/js'));
	res.sendFile(path.join(__dirname+"/html/yonlendirme.html"));
});

server.listen(8000, function(){
	console.log("Server Başladı. Port:8000 dinleniyor.");
});