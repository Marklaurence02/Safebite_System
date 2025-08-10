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

// Wi-Fi and Server Info - CHANGE THESE!
#define WIFI_SSID "TP-Link_DA40"  // Change this to your WiFi name
#define WIFI_PASS "84332363"      // Change this to your WiFi password
#define SERVER_HOST "192.168.0.108"
#define SERVER_PATH "/SafeBite/backend/api/sensor-data.php"

// Sensors
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DHT dht(DHTPIN, DHTTYPE);
SoftwareSerial espSerial(ESP_RX, ESP_TX);

// WiFi status
bool wifiConnected = false;
unsigned long lastWifiAttempt = 0;
const unsigned long WIFI_RETRY_INTERVAL = 60000; // Try every 60 seconds

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
  lcd.print("SafeBite WiFi Fix");
  lcd.setCursor(0, 1);
  lcd.print("Testing Connection");
  delay(2000);

  Serial.println("=== SafeBite WiFi Fix ===");
  Serial.println("Current WiFi Settings:");
  Serial.println("SSID: " + String(WIFI_SSID));
  Serial.println("Password: " + String(WIFI_PASS));
  Serial.println("=========================");

  // Try to connect WiFi
  connectWiFi();
}

void connectWiFi() {
  Serial.println("Attempting WiFi connection...");
  
  // Reset ESP8266
  espSerial.println("AT+RST");
  delay(3000);
  
  // Set to Station mode
  espSerial.println("AT+CWMODE=1");
  delay(2000);
  
  // Connect to WiFi
  String cmd = "AT+CWJAP=\"" + String(WIFI_SSID) + "\",\"" + String(WIFI_PASS) + "\"";
  Serial.println("Connecting to: " + String(WIFI_SSID));
  espSerial.println(cmd);
  
  // Wait for connection
  unsigned long startTime = millis();
  while (millis() - startTime < 15000) {
    if (espSerial.available()) {
      String response = espSerial.readString();
      Serial.println("ESP Response: " + response);
      
      if (response.indexOf("OK") >= 0) {
        wifiConnected = true;
        Serial.println("✅ WiFi connected successfully!");
        lcd.setCursor(0, 0);
        lcd.print("WiFi: Connected!");
        lcd.setCursor(0, 1);
        lcd.print("Sensors Active");
        delay(2000);
        return;
      }
      if (response.indexOf("FAIL") >= 0) {
        Serial.println("❌ WiFi connection failed");
        break;
      }
    }
    delay(100);
  }
  
  wifiConnected = false;
  Serial.println("❌ WiFi connection failed after timeout");
  lcd.setCursor(0, 0);
  lcd.print("WiFi: Failed!");
  lcd.setCursor(0, 1);
  lcd.print("Check SSID/PASS");
  delay(3000);
}

void sendToServer(float temp, float hum, int gas) {
  if (!wifiConnected) {
    return;
  }
  
  Serial.println("Sending data to server...");
  
  // Clear buffer
  while (espSerial.available()) {
    espSerial.read();
  }
  
  espSerial.println("AT+CIPMUX=0");
  delay(1000);
  
  String cmd = "AT+CIPSTART=\"TCP\",\"" + String(SERVER_HOST) + "\",80";
  espSerial.println(cmd);
  delay(2000);
  
  if (espSerial.find("OK")) {
    String url = SERVER_PATH "?temp=" + String(temp, 1) + "&hum=" + String(hum, 1) + "&gas=" + String(gas);
    String request = "GET " + url + " HTTP/1.1\r\nHost: " + SERVER_HOST + "\r\nConnection: close\r\n\r\n";
    
    espSerial.print("AT+CIPSEND=");
    espSerial.println(request.length());
    delay(1000);
    
    if (espSerial.find(">")) {
      espSerial.print(request);
      Serial.println("✅ Data sent to server!");
      
      delay(2000);
      while (espSerial.available()) {
        espSerial.read(); // Clear response
      }
    } else {
      Serial.println("❌ Send failed");
    }
  } else {
    Serial.println("❌ Server connection failed");
  }
  
  espSerial.println("AT+CIPCLOSE");
  delay(500);
}

void loop() {
  int gasValue = analogRead(Sensor);
  sensors.requestTemperatures();
  float dsTemp = sensors.getTempCByIndex(0);
  float h = dht.readHumidity();

  // LCD Display
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

  // Serial Output
  Serial.print("Gas: "); Serial.print(gasValue);
  Serial.print(" | Temp: "); Serial.print(dsTemp);
  Serial.print(" | Hum: "); Serial.println(h);

  // Try to reconnect WiFi if disconnected
  if (!wifiConnected && (millis() - lastWifiAttempt > WIFI_RETRY_INTERVAL)) {
    Serial.println("Retrying WiFi connection...");
    lastWifiAttempt = millis();
    connectWiFi();
  }

  // Send to Web Server (only if WiFi is connected)
  if (wifiConnected) {
    sendToServer(dsTemp, h, gasValue);
  }

  delay(10000); // every 10 seconds
}
