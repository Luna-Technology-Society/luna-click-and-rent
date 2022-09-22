/*
  LED

  This example creates a Bluetooth® Low Energy peripheral with service that contains a
  characteristic to control an LED.

  The circuit:
  - Arduino MKR WiFi 1010, Arduino Uno WiFi Rev2 board, Arduino Nano 33 IoT,
    Arduino Nano 33 BLE, or Arduino Nano 33 BLE Sense board.

  You can use a generic Bluetooth® Low Energy central app, like LightBlue (iOS and Android) or
  nRF Connect (Android), to interact with the services and characteristics
  created in this sketch.

  This example code is in the public domain.
*/

#include <ArduinoBLE.h>

#define BIN1 4 //motor channel 1
#define BIN2 5 //motor channel 2
#define PWMB 3 //pwm control
#define STBY 7 // standby, have to be HIGH to run motor

const int LED = LED_BUILTIN; // pin to use for the LED

BLEService ledService("19B10000-E8F2-537E-4F6C-D104768A1214"); // Bluetooth® Low Energy LED Service

// Bluetooth® Low Energy LED Switch Characteristic - custom 128-bit UUID, read and writable by central
BLEByteCharacteristic switchCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);

<<<<<<< HEAD
=======
const int ledPin = LED_BUILTIN; // pin to use for the LED
boolean doorIsLocked = true;

>>>>>>> e49078947d21e1928ba8fc0e1510b9ae8b849bd1
void setup() {
  Serial.begin(9600);
  //  while (!Serial);

  // set  pins to output mode
  pinMode(BIN1,OUTPUT);
  pinMode(BIN2,OUTPUT);
  pinMode(PWMB,OUTPUT);
  pinMode(STBY,OUTPUT);
  pinMode(LED,OUTPUT);

  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy module failed!");

    while (1);
  }

  // set advertised local name and service UUID:
  BLE.setLocalName("Door 1");
  BLE.setAdvertisedService(ledService);

  // add the characteristic to the service
  ledService.addCharacteristic(switchCharacteristic);

  // add service
  BLE.addService(ledService);

  // set the initial value for the characeristic:
  switchCharacteristic.writeValue(0);

  // start advertising
  BLE.advertise();
  
  // The door is locked by default.
  lockDoor();

  Serial.println("BLE LED Peripheral");
}

void loop() {
  // listen for Bluetooth® Low Energy peripherals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

    // while the central is still connected to peripheral:
    while (central.connected()) {
      // if the remote device wrote to the characteristic,
      // use the value to control the LED:
      if (switchCharacteristic.written()) {
        if (switchCharacteristic.value()) {   // any value other than 0
          lockDoor();
        } else {                              // a 0 value
          unlockDoor();
        }
      }
    }

    // when the central disconnects, print it out:
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
    // make sure the door is locked when the bluetooth device disconnects
    lockDoor();
  }
}

<<<<<<< HEAD
//void lockdoor() {
//  Serial.println("LED on");
//  digitalWrite(ledPin, HIGH);         // will turn the LED on
//};

//void unlockdoor() {
//  Serial.println(F("LED off"));
//  digitalWrite(ledPin, LOW);          // will turn the LED off
//}

// unlock door 
void unlockDoor(){
  digitalWrite(BIN1,HIGH);
  digitalWrite(BIN2,LOW);
  digitalWrite(PWMB,HIGH);
  digitalWrite(STBY,HIGH);
  digitalWrite(LED,LOW);
  Serial.println("door open");
  delay(1400);
  digitalWrite(STBY,LOW);
  Serial.println("STBY");
}

//lock door
void lockDoor(){
  digitalWrite(BIN1,LOW);
  digitalWrite(BIN2,HIGH);
  digitalWrite(PWMB,HIGH);
  digitalWrite(STBY,HIGH);
  digitalWrite(LED,HIGH);
  Serial.println("door locked");
  delay(1400);
  digitalWrite(STBY,LOW);
  Serial.println("STBY");
}

//set motor controler to standby mode 
void setControllerToSTBY(){
  digitalWrite(BIN1,LOW);
  digitalWrite(BIN2,LOW);
  digitalWrite(STBY,LOW);
  digitalWrite(LED,HIGH);
=======
void lockdoor() {
  if(!doorIsLocked){
    Serial.println("LED on");
    digitalWrite(ledPin, HIGH);         // will turn the LED on
    doorIsLocked = true;
  }
};

void unlockdoor() {
  if(doorIsLocked){
    Serial.println(F("LED off"));
    digitalWrite(ledPin, LOW);          // will turn the LED off
  }
  doorIsLocked = false;
>>>>>>> e49078947d21e1928ba8fc0e1510b9ae8b849bd1
}
