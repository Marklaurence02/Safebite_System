#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>
#include <SoftwareSerial.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

// Pins
#define LED 2
#define Buzzer 3
#define Sensor A1
#define ONE_WIRE_BUS 7
#define DHTPIN 6
#define DHTTYPE DHT11

// ESP8266-01S Pin Configuration
#define ESP_RX 8  // Arduino Pin 8 -> ESP8266-01S TX
#define ESP_TX 9  // Arduino Pin 9 -> ESP8266-01S RX

// Wi-Fi and Server Info
#define WIFI_SSID "TP-Link_DA40"
#define WIFI_PASS "84332363"
#define SERVER_HOST "192.168.0.108"
#define SERVER_PATH "/SafeBite/backend/api/sensor-data.php"

// Sensors
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DHT dht(DHTPIN, DHTTYPE);
SoftwareSerial espSerial(ESP_RX, ESP_TX);

// Sleep mode settings
bool espAwake = false;
unsigned long lastWakeTime = 0;
const unsigned long WAKE_INTERVAL = 120000; // Wake every 2 minutes
const unsigned long SLEEP_DURATION = 30000; // Sleep for 30 seconds after sending

void wakeESP8266() {
  Serial.println("Waking up ESP8266-01S...");
  
  // Reset ESP8266
  espSerial.println("AT+RST");
  delay(3000);
  
  // Set to Station mode
  espSerial.println("AT+CWMODE=1");
  delay(2000);
  
  // Connect to WiFi
  String cmd = "AT+CWJAP=\"" + String(WIFI_SSID) + "\",\"" + String(WIFI_PASS) + "\"";
  espSerial.println(cmd);
  
  unsigned long startTime = millis();
  while (millis() - startTime < 15000) {
    if (espSerial.find("OK")) {
      espAwake = true;
      Serial.println("ESP8266-01S awake and connected!");
      return;
    }
    if (espSerial.find("FAIL")) {
      Serial.println("WiFi connection failed");
      break;
    }
    delay(100);
  }
  
  espAwake = false;
  Serial.println("Failed to wake ESP8266-01S");
}

void sleepESP8266() {
  if (espAwake) {
    Serial.println("Putting ESP8266-01S to sleep...");
    espSerial.println("AT+SLEEP=1"); // Light sleep mode
    delay(1000);
    espAwake = false;
  }
}

void sendDataAndSleep(float temp, float hum, int gas) {
  if (!espAwake) {
    wakeESP8266();
  }
  
  if (!espAwake) {
    Serial.println("Cannot send data - ESP8266 not awake");
    return;
  }
  
  Serial.println("Sending data...");
  
  // Clear buffer
  while (espSerial.available()) {
    espSerial.read();
  }
  
  // Quick connection
  espSerial.println("AT+CIPMUX=0");
  delay(500);
  
  String cmd = "AT+CIPSTART=\"TCP\",\"" + String(SERVER_HOST) + "\",80";
  espSerial.println(cmd);
  delay(2000);
  
  if (espSerial.find("OK")) {
    String url = SERVER_PATH "?temp=" + String(temp, 1) + "&hum=" + String(hum, 1) + "&gas=" + String(gas);
    String request = "GET " + url + " HTTP/1.1\r\nHost: " + SERVER_HOST + "\r\nConnection: close\r\n\r\n";
    
    espSerial.print("AT+CIPSEND=");
    espSerial.println(request.length());
    delay(500);
    
    if (espSerial.find(">")) {
      espSerial.print(request);
      Serial.println("Data sent successfully!");
      
      // Quick response check
      delay(1000);
      while (espSerial.available()) {
        espSerial.read();
      }
    } else {
      Serial.println("Send failed");
    }
  } else {
    Serial.println("Connection failed");
  }
  
  espSerial.println("AT+CIPCLOSE");
  delay(500);
  
  // Put ESP8266 back to sleep
  sleepESP8266();
}

void setup() {
  Serial.begin(9600);
  espSerial.begin(115200);

  lcd.init();
  lcd.backlight();
  pinMode(LED, OUTPUT);
  pinMode(Buzzer, OUTPUT);

  sensors.begin();
  dht.begin();

  // Display startup message
  lcd.setCursor(0, 0);
  lcd.print("SafeBite Sleep");
  lcd.setCursor(0, 1);
  lcd.print("Mode USB Only");
  delay(2000);

  // Start with ESP8266 asleep
  espAwake = false;
}

void loop() {
  int gasValue = analogRead(Sensor);
  sensors.requestTemperatures();
  float dsTemp = sensors.getTempCByIndex(0);
  float h = dht.readHumidity();

  // LCD Display (always works)
  lcd.setCursor(0, 0);
  lcd.print("Gas:");
  lcd.print(gasValue);
  lcd.print("    ");

  lcd.setCursor(0, 1);
  if (gasValue > 400) {
    digitalWrite(LED, HIGH);
    digitalWrite(Buzzer, HIGH);
    lcd.print("GAS Detected!  ");
  } else {
    digitalWrite(LED, LOW);
    digitalWrite(Buzzer, LOW);
    lcd.print("T:");
    lcd.print(dsTemp, 1);
    lcd.print("C H:");
    lcd.print(h, 0);
    lcd.print("% ");
  }

  // Serial Output (always works)
  Serial.print("Gas: "); Serial.print(gasValue);
  Serial.print(" | Temp: "); Serial.print(dsTemp);
  Serial.print(" | Hum: "); Serial.println(h);

  // Check if it's time to wake up and send data
  if (millis() - lastWakeTime > WAKE_INTERVAL) {
    sendDataAndSleep(dsTemp, h, gasValue);
    lastWakeTime = millis();
  }

  delay(10000); // 10 second sensor reading interval
}
