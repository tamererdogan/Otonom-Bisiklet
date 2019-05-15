var socket = io.connect();

socket.on("htmlPwm", function(pwm){
	document.getElementById("pwm").innerHTML = pwm;
}); 

socket.on("htmlHedefAci", function(hedefAci){
	document.getElementById("hedefAci").innerHTML = hedefAci;
});

socket.on("htmlAnlikAci", function(anlikAci){	
	document.getElementById("anlikAci").innerHTML = anlikAci;
});

socket.on("htmlHata", function(hata){	
	document.getElementById("hata").innerHTML = hata;
});

function sifirla()
{
	console.log("Sıfırlama Butonuna Basıldı");
	socket.emit("sifirla");
}

window.onkeydown=function(e){
             
	//65              
	if(e.keyCode==37) //Sol 
	{
	  console.log("Tuşa basıldı: Sol");
	  socket.emit('aciArttir');
	}
	//87
	else if(e.keyCode==38) //Üst
	{
	  console.log("Tuşa basıldı: Üst");
	  socket.emit('hizArttir');       
	}
	//68
	else if(e.keyCode==39)  //Sağ
	{
	  console.log("Tuşa basıldı: Sağ");
	  socket.emit('aciAzalt');
	}
	//83
	else if(e.keyCode==40) //Alt
	{
	  console.log("Tuşa basıldı: Alt");
	  socket.emit('hizAzalt');          
	}       
}  