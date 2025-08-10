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

// Debug mode
bool debugMode = true;
bool wifiConnected = false;

void debugPrint(String message) {
  if (debugMode) {
    Serial.println("[DEBUG] " + message);
  }
}

void testESP8266Communication() {
  debugPrint("=== Testing ESP8266 Communication ===");
  
  // Clear buffer
  while (espSerial.available()) {
    espSerial.read();
  }
  
  // Test 1: Basic AT command
  debugPrint("Test 1: Sending AT command");
  espSerial.println("AT");
  delay(2000);
  
  while (espSerial.available()) {
    String response = espSerial.readString();
    debugPrint("AT Response: " + response);
  }
  
  delay(1000);
  
  // Test 2: Get firmware version
  debugPrint("Test 2: Getting firmware version");
  espSerial.println("AT+GMR");
  delay(2000);
  
  while (espSerial.available()) {
    String response = espSerial.readString();
    debugPrint("Firmware: " + response);
  }
  
  delay(1000);
}

void connectWiFi() {
  debugPrint("=== Starting WiFi Connection ===");
  
  // Clear buffer
  while (espSerial.available()) {
    espSerial.read();
  }
  
  // Step 1: Reset ESP8266
  debugPrint("Step 1: Resetting ESP8266");
  espSerial.println("AT+RST");
  delay(5000);
  
  while (espSerial.available()) {
    String response = espSerial.readString();
    debugPrint("Reset Response: " + response);
  }
  
  delay(2000);
  
  // Step 2: Set WiFi mode
  debugPrint("Step 2: Setting WiFi mode to Station");
  espSerial.println("AT+CWMODE=1");
  delay(2000);
  
  while (espSerial.available()) {
    String response = espSerial.readString();
    debugPrint("Mode Response: " + response);
  }
  
  delay(2000);
  
  // Step 3: Try to connect to WiFi
  debugPrint("Step 3: Attempting WiFi connection");
  debugPrint("SSID: " + String(WIFI_SSID));
  debugPrint("Password: " + String(WIFI_PASS));
  
  String cmd = "AT+CWJAP=\"" + String(WIFI_SSID) + "\",\"" + String(WIFI_PASS) + "\"";
  espSerial.println(cmd);
  
  // Wait for connection with detailed monitoring
  unsigned long startTime = millis();
  bool connected = false;
  
  debugPrint("Waiting for WiFi response...");
  
  while (millis() - startTime < 20000) { // 20 second timeout
    if (espSerial.available()) {
      String response = espSerial.readString();
      debugPrint("WiFi Response: " + response);
      
      if (response.indexOf("OK") >= 0) {
        connected = true;
        debugPrint("SUCCESS: WiFi connection established!");
        break;
      }
      if (response.indexOf("FAIL") >= 0) {
        debugPrint("FAILED: WiFi connection failed");
        break;
      }
      if (response.indexOf("ERROR") >= 0) {
        debugPrint("ERROR: WiFi connection error");
        break;
      }
    }
    delay(100);
  }
  
  if (connected) {
    wifiConnected = true;
    debugPrint("WiFi connection successful!");
    lcd.setCursor(0, 0);
    lcd.print("WiFi: Connected!");
    lcd.setCursor(0, 1);
    lcd.print("Testing Server...");
    delay(2000);
    
    // Get IP address
    debugPrint("Getting IP address...");
    espSerial.println("AT+CIFSR");
    delay(2000);
    
    while (espSerial.available()) {
      String response = espSerial.readString();
      debugPrint("IP Response: " + response);
    }
    
  } else {
    wifiConnected = false;
    debugPrint("WiFi connection failed after timeout!");
    lcd.setCursor(0, 0);
    lcd.print("WiFi: Failed!");
    lcd.setCursor(0, 1);
    lcd.print("Check Debug Log");
    delay(3000);
  }
  
  // Clear any remaining data
  while (espSerial.available()) {
    espSerial.read();
  }
}

void testServerConnection() {
  if (!wifiConnected) {
    debugPrint("Cannot test server - WiFi not connected");
    return;
  }
  
  debugPrint("=== Testing Server Connection ===");
  
  // Clear buffer
  while (espSerial.available()) {
    espSerial.read();
  }
  
  debugPrint("Setting single connection mode");
  espSerial.println("AT+CIPMUX=0");
  delay(1000);
  
  while (espSerial.available()) {
    String response = espSerial.readString();
    debugPrint("CIPMUX Response: " + response);
  }
  
  delay(1000);
  
  String cmd = "AT+CIPSTART=\"TCP\",\"" + String(SERVER_HOST) + "\",80";
  debugPrint("Connecting to server: " + String(SERVER_HOST));
  espSerial.println(cmd);
  delay(3000);
  
  while (espSerial.available()) {
    String response = espSerial.readString();
    debugPrint("Server Connection Response: " + response);
  }
  
  delay(1000);
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
  lcd.print("SafeBite Debug");
  lcd.setCursor(0, 1);
  lcd.print("Testing WiFi...");
  delay(2000);

  Serial.println("=== SafeBite WiFi Debug Mode ===");
  Serial.println("This will show detailed WiFi connection steps");
  Serial.println("=============================================");

  // Test ESP8266 communication first
  testESP8266Communication();
  
  // Try to connect WiFi
  connectWiFi();
  
  // Test server connection if WiFi works
  testServerConnection();
  
  Serial.println("=== Debug Setup Complete ===");
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
  Serial.print("Sensors: Gas="); Serial.print(gasValue);
  Serial.print(" Temp="); Serial.print(dsTemp);
  Serial.print(" Hum="); Serial.println(h);

  delay(5000); // every 5 seconds
}

