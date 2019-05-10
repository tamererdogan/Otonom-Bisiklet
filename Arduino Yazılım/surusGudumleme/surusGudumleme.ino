/* PIN TANIMLAMALARI */
int Rx = 2; //Rx ile bağlanıldı 
int encoder_a = 3; //Enkoderin A portu
int encoder_b = 4; //Enkoderin B portu
int hubMotorPin = 6; //
int solYon = 9; //Direksiyonun saat yönünün tersine dönmesi için pwm çıkışı
int sagYon = 10; //Direksiyonun saat yönüne dönmesi için pwm çıkışı
int hizEnkoderi = 12; //Arka teker enkoderi

/* DEĞİŞKENLER */
int hubMotorPwm = 0; //Hub motora verilen pwm değeri
int hedefAci = 0; //Gidilecek olan açı
int suankiAci = 0; //Şuan ki açı
char okunan; //Seriport'tan gelen karakteri tutar
signed long int darbe = 0; //Enkoderden okunan Pals(Darbe) sayısı

void seriHaberlesmeKesmesi()
{
  okunan = Serial.read();
  switch(okunan)
  {
    //A ve D'yi server'la aynı tarzda yaz arttırma eksiltme olayını
    case 'w':
      if(hubMotorPwm >= 190)
      {
        break;
      }else
      {
        hubMotorPwm += 10;  
        break;
      }
    case 's':
      if(hubMotorPwm <= 0)
      {
        break;
      }else
      {
        hubMotorPwm -= 10;
        break;
      }    
    case 'a':
      if(hedefAci >= 60)
      {
        break;
      }else
      {
        hedefAci -= 1;
        break;
      }      
    case 'd':
      if(hedefAci <= -60)
      {
        break;
      }else
      {
        hedefAci += 1;             
        break;
      }     
  }
}

void encoder_kesme_a()
{
  if(digitalRead(encoder_a) == HIGH)
  {
    if(digitalRead(encoder_b) == HIGH)
    {
      darbe -= 1;
    }else
    {
      darbe++;
    }
  }else
  {
    if(digitalRead(encoder_b) == HIGH)
    {
      darbe++;
    }else
    {
      darbe -= 1;
    }    
  }
}

void setup() 
{
  Serial.begin (115200); //Seri haberleşme başlatıldı
  pinMode(Rx, INPUT); //2 numaralı pin giriş olarak ayarlandı
  pinMode(encoder_a, INPUT); //3 numaralı pin giriş olarak ayarlandı
  pinMode(encoder_b, INPUT); //4 numaralı pin giriş olarak ayarlandı
  pinMode(hizEnkoderi, INPUT); //12 numaralı pin giriş olarak ayarlandı
  attachInterrupt(0, seriHaberlesmeKesmesi,CHANGE); //2 numaralı girişe kesme fonksiyonu atandı 
  attachInterrupt(1, encoder_kesme_a, CHANGE); //3 numaralı girişe kesme fonksiyonu atandı 
}

void loop() 
{

  //Arka enkoderin kodu eklenecek

  
  //  200(Pals) * 15(Redüktör Oranı) = 3000 (1 turda oluşan Pals Sayısı)
  //  360/3000 = 0.12 (1 Palsa denk gelen açı değeri)
  suankiAci = int(darbe*0.12);
  if(suankiAci >= 360 || suankiAci <= -360)
  {
    suankiAci = suankiAci%360;
  }
  
  //A D hareketlendirme
  if(hedefAci < 0)
  {
    analogWrite(sagYon, 0);
    analogWrite(solYon, 15);
  }else if(hedefAci > 0)
  {
    analogWrite(sagYon, 15);
    analogWrite(solYon, 0);
  }else
  {
    analogWrite(sagYon, 0);
    analogWrite(solYon, 0);
  }

  analogWrite(hubMotorPin, hubMotorPwm);
 
  Serial.write(hubMotorPwm);
  Serial.write(hedefAci);
  //Serial.write(suankiAci); 
  delay(50);
}
