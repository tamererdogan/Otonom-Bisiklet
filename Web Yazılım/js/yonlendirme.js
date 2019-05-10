var socket = io.connect();

socket.on("htmlHiz", function(hiz){
	document.getElementById("hiz").innerHTML = hiz;
}); 

socket.on("htmlAci", function(aci){
	document.getElementById("aci").innerHTML = aci;
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