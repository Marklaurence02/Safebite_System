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
#define ESP_RX 8  // Arduino RX
#define ESP_TX 9  // Arduino TX

// Wi-Fi and Server Info - Updated for SafeBite
#define WIFI_SSID "TP-Link_DA40"
#define WIFI_PASS "84332363"
#define SERVER_HOST "192.168.0.108"
#define SERVER_PATH "/SafeBite/backend/api/sensor-data.php"

// Sensors
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DHT dht(DHTPIN, DHTTYPE);
SoftwareSerial espSerial(ESP_RX, ESP_TX);

void sendToServer(float temp, float hum, int gas) {
  espSerial.println("AT+CIPMUX=0");
  delay(500);

  String cmd = "AT+CIPSTART=\"TCP\",\"" + String(SERVER_HOST) + "\",80";
  espSerial.println(cmd);
  delay(2000);
  if (!espSerial.find("OK")) {
    Serial.println("Connection failed");
    return;
  }

  // Create the URL with sensor data
  String url = SERVER_PATH "?temp=" + String(temp, 1) + "&hum=" + String(hum, 1) + "&gas=" + String(gas);
  
  // Create HTTP GET request
  String request = "GET " + url + " HTTP/1.1\r\n";
  request += "Host: " + String(SERVER_HOST) + "\r\n";
  request += "Connection: close\r\n\r\n";

  espSerial.print("AT+CIPSEND=");
  espSerial.println(request.length());
  delay(1000);
  
  if (espSerial.find(">")) {
    espSerial.print(request);
    Serial.println("Data sent to SafeBite server!");
    
    // Wait for response
    delay(2000);
    while (espSerial.available()) {
      String response = espSerial.readString();
      Serial.println("Server response: " + response);
    }
  } else {
    Serial.println("Send failed");
  }

  delay(500);
  espSerial.println("AT+CIPCLOSE");
}

void connectWiFi() {
  espSerial.println("AT+RST");
  delay(3000);

  espSerial.println("AT+CWMODE=1");
  delay(1000);

  String cmd = "AT+CWJAP=\"" + String(WIFI_SSID) + "\",\"" + String(WIFI_PASS) + "\"";
  espSerial.println(cmd);
  delay(6000);

  if (espSerial.find("OK")) {
    Serial.println("WiFi connected!");
    lcd.setCursor(0, 0);
    lcd.print("WiFi Connected!");
    delay(2000);
  } else {
    Serial.println("WiFi failed to connect.");
    lcd.setCursor(0, 0);
    lcd.print("WiFi Failed!");
    delay(2000);
  }
}

void setup() {
  Serial.begin(9600);
  espSerial.begin(9600);

  lcd.init();
  lcd.backlight();
  pinMode(LED, OUTPUT);
  pinMode(Buzzer, OUTPUT);

  sensors.begin();
  dht.begin();

  // Display startup message
  lcd.setCursor(0, 0);
  lcd.print("SafeBite Sensor");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");
  delay(2000);

  connectWiFi();  // Connect to WiFi on boot
}

void loop() {
  int gasValue = analogRead(Sensor);
  sensors.requestTemperatures();
  float dsTemp = sensors.getTempCByIndex(0);
  float h = dht.readHumidity();
  float t = dht.readTemperature();  // Optional if you want DHT temp too

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

  // Send to SafeBite Web Server
  sendToServer(dsTemp, h, gasValue);

  delay(10000); // every 10 seconds
}
