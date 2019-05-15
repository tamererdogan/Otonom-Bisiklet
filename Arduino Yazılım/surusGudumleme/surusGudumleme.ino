/* PIN TANIMLAMALARI */
int Rx = 2; //Rx ile bağlanıldı 
int encoder_a = 3; //Enkoderin A portu
int encoder_b = 4; //Enkoderin B portu
int hubMotorPin = 6; //Hub motor pwm pini
int solYon = 9; //Direksiyonun saat yönünün tersine dönmesi için pwm çıkışı
int sagYon = 10; //Direksiyonun saat yönüne dönmesi için pwm çıkışı

/* DEĞİŞKENLER */
int hubMotorPwm = 0; //Hub motora verilen pwm değeri
int hedefAci = 0; //Gidilecek olan açı
int anlikAci = 0; //Şuan ki açı
int hata = 0; //hedefAci ile anlikAci arasındaki fark
char okunan; //Seriport'tan gelen karakteri tutar
signed long int darbe = 0; //Enkoderden okunan Pals(Darbe) sayısı

void motor_sur(int pwm, int hata)
{
  if(hata > 0)
  {
    analogWrite(sagYon, 0);
    analogWrite(solYon, pwm);
  }else if(hata < 0)
  {
    analogWrite(sagYon, pwm);
    analogWrite(solYon, 0);
  }else
  {
    analogWrite(sagYon, 0);
    analogWrite(solYon, 0);
  }  
}

void seriHaberlesmeKesmesi()
{
  okunan = Serial.read();
  switch(okunan)
  {
    case 'x':
      darbe = 0;
      hedefAci = 0;
      break;
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
    case 'd':
      if(hedefAci > -60)
      {
        hedefAci -= 1;
        break;
      }else
      {        
        break;
      }    
    case 'a':
      if(hedefAci < 60)
      {
        hedefAci += 1;
        break;
      }else
      {                    
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
  pinMode(hubMotorPin, OUTPUT); //6 numaralı pin çıkış olarak ayarlandı
  pinMode(solYon, OUTPUT); //9 numaralı pin çıkış olarak ayarlandı
  pinMode(sagYon, OUTPUT); //10 numaralı pin çıkış olarak ayarlandı    
  attachInterrupt(0, seriHaberlesmeKesmesi,CHANGE); //2 numaralı girişe kesme fonksiyonu atandı 
  attachInterrupt(1, encoder_kesme_a, CHANGE); //3 numaralı girişe kesme fonksiyonu atandı 
}

void loop() 
{
  //  200(Pals) * 15(Redüktör Oranı) = 3000 (1 turda oluşan Pals Sayısı)
  //  360/3000 = 0.12 (1 Palsa denk gelen açı değeri)
  anlikAci = int(darbe*0.12);
  
  if(anlikAci >= 360 || anlikAci <= -360)
  {
    anlikAci = anlikAci%360;
  }
  
  hata = hedefAci - anlikAci;
  motor_sur(15, hata);
  
  analogWrite(hubMotorPin, hubMotorPwm);
  Serial.write(hubMotorPwm); 
  Serial.write(anlikAci);
  Serial.write(hedefAci);
  Serial.write(hata);
    
  delay(10);
}
