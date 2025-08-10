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

// Low power mode settings
bool wifiConnected = false;
unsigned long lastDataSend = 0;
const unsigned long SEND_INTERVAL = 60000; // Send data every 60 seconds instead of 10
int sendAttempts = 0;
const int MAX_SEND_ATTEMPTS = 3;

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
  lcd.print("SafeBite Low Power");
  lcd.setCursor(0, 1);
  lcd.print("USB Only Mode");
  delay(2000);

  // Try to connect WiFi once at startup
  connectWiFiOnce();
}

void connectWiFiOnce() {
  Serial.println("Attempting WiFi connection (USB power mode)...");
  
  // Reset ESP8266
  espSerial.println("AT+RST");
  delay(3000);
  
  // Set to Station mode
  espSerial.println("AT+CWMODE=1");
  delay(2000);
  
  // Connect to WiFi with minimal power usage
  String cmd = "AT+CWJAP=\"" + String(WIFI_SSID) + "\",\"" + String(WIFI_PASS) + "\"";
  espSerial.println(cmd);
  
  // Wait for connection
  unsigned long startTime = millis();
  while (millis() - startTime < 15000) {
    if (espSerial.find("OK")) {
      wifiConnected = true;
      Serial.println("WiFi connected!");
      lcd.setCursor(0, 0);
      lcd.print("WiFi: Connected");
      delay(2000);
      return;
    }
    if (espSerial.find("FAIL")) {
      Serial.println("WiFi failed");
      break;
    }
    delay(100);
  }
  
  wifiConnected = false;
  Serial.println("WiFi connection failed - continuing without WiFi");
  lcd.setCursor(0, 0);
  lcd.print("WiFi: Offline");
  lcd.setCursor(0, 1);
  lcd.print("Sensors Active");
  delay(2000);
}

void sendDataLowPower(float temp, float hum, int gas) {
  if (!wifiConnected || sendAttempts >= MAX_SEND_ATTEMPTS) {
    return;
  }
  
  Serial.println("Sending data (low power mode)...");
  
  // Clear buffer
  while (espSerial.available()) {
    espSerial.read();
  }
  
  // Quick connection setup
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
      sendAttempts = 0; // Reset attempts on success
      
      // Quick response check
      delay(1000);
      while (espSerial.available()) {
        espSerial.read(); // Clear response
      }
    } else {
      Serial.println("Send failed");
      sendAttempts++;
    }
  } else {
    Serial.println("Connection failed");
    sendAttempts++;
  }
  
  espSerial.println("AT+CIPCLOSE");
  delay(500);
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

  // Send data less frequently to save power
  if (millis() - lastDataSend > SEND_INTERVAL) {
    if (wifiConnected) {
      sendDataLowPower(dsTemp, h, gasValue);
    } else {
      Serial.println("WiFi offline - sensors still working");
    }
    lastDataSend = millis();
  }

  delay(10000); // 10 second sensor reading interval
}
