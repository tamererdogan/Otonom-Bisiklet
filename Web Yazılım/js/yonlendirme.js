var socket = io.connect();

socket.on("htmlPwm", function(pwm){
	document.getElementById("pwm").innerHTML = pwm;
}); 

socket.on("htmlAnlikHiz", function(anlikHiz){
	console.log(aci);
	document.getElementById("anlikHiz").innerHTML = anlikHiz;
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

window.onkeydown=function(e){
              
	if(e.keyCode==37) //Sol 
	{
	  console.log("Tuşa basıldı: Sol");
	  socket.emit('aciAzalt');
	}
	else if(e.keyCode==38) //Üst
	{
	  console.log("Tuşa basıldı: Üst");
	  socket.emit('hizArttir');       
	}
	else if(e.keyCode==39)  //Sağ
	{
	  console.log("Tuşa basıldı: Sağ");
	  socket.emit('aciArttir');          
	}
	else if(e.keyCode==40) //Alt
	{
	  console.log("Tuşa basıldı: Alt");
	  socket.emit('hizAzalt');          
	}       
}  