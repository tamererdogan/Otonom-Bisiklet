var socket = io.connect();

socket.emit("baglantiDurumuNedir");

socket.on("portlar", function(ports){
	
	var selectBox = document.getElementById("portlar");

	//Select box içerisini sıfırlama
	selectBox.innerHTML = "";

	for (var i = 0; i < ports.length; i++)
	{
		var option = document.createElement("option");
		option.text = ports[i].comName;
		selectBox.add(option, selectBox[0]);
	}
}); 

socket.on("baglantiDurumu", function(durum){
	//console.log("Bağlantı durumu:" + durum);
	var durumEtiketi = document.getElementById("baglantiDurumu");
	var yonlendirmeBaglantisi = document.getElementById("yonlendirmeBaglantisi");
	if (durum)
	{
		durumEtiketi.innerHTML = "Arduino'ya Bağlanıldı.";
		durumEtiketi.style.color = "green";
		yonlendirmeBaglantisi.style.display = "inline-block";
	}else
	{
		durumEtiketi.innerHTML = "Arduino'ya Bağlanılmadı";
		durumEtiketi.style.color = "red";	
		yonlendirmeBaglantisi.style.display = "none";	
	}
	
});

function yenile()
{
	socket.emit("yenile");
}

function baglan()
{
	var portName = document.getElementById("portlar").value;
	socket.emit("baglan", portName);
}

function baglantiKes()
{
	socket.emit("baglantiyiKes");
}