// definition of ports

#define BIN1 4 //motor chanel 1
#define BIN2 5 //motor chanel 2
#define PWMB 3 //pwm control
#define STBY 7 // standby, have to be HIGH to run motor
const int LED = LED_BUILTIN;

void setup() {
  // pin mode initialization
  pinMode(BIN1,OUTPUT);
  pinMode(BIN2,OUTPUT);
  pinMode(PWMB,OUTPUT);
  pinMode(STBY,OUTPUT);
  pinMode(LED,OUTPUT);

}

void loop() {
  delay(2000);
  openDoor();
  delay(1400);
  setControllerToSTBY();
  lockDoor();
  delay(1400);
  
}

// opens door 
void openDoor(){
  digitalWrite(BIN1,HIGH);
  digitalWrite(BIN2,LOW);
  digitalWrite(PWMB,HIGH);
  digitalWrite(STBY,HIGH);
  digitalWrite(LED,LOW);
  Serial.println("door open");
}

//locks door
void lockDoor(){
  digitalWrite(BIN1,LOW);
  digitalWrite(BIN2,HIGH);
  digitalWrite(PWMB,HIGH);
  digitalWrite(STBY,HIGH);
  digitalWrite(LED,HIGH);
  Serial.println("door locked");
}

//set motor controler to standby mode 
void setControllerToSTBY(){
  digitalWrite(BIN1,LOW);
  digitalWrite(BIN2,LOW);
  digitalWrite(STBY,LOW);
  digitalWrite(LED,HIGH);
}