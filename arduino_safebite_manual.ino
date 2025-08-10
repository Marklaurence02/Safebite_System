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

// ESP8266-01S Pin Configuration (not used in manual mode)
#define ESP_RX 8  // Arduino Pin 8 -> ESP8266-01S TX
#define ESP_TX 9  // Arduino Pin 9 -> ESP8266-01S RX

// Sensors
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DHT dht(DHTPIN, DHTTYPE);
SoftwareSerial espSerial(ESP_RX, ESP_TX);

// Manual mode settings
unsigned long lastReading = 0;
const unsigned long READING_INTERVAL = 5000; // Read every 5 seconds
int readingCount = 0;
const int MAX_READINGS = 100; // Store last 100 readings

// Data storage (simplified)
struct SensorReading {
  float temperature;
  float humidity;
  int gas;
  unsigned long timestamp;
};

SensorReading readings[100];
int currentIndex = 0;

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
  lcd.print("SafeBite Manual");
  lcd.setCursor(0, 1);
  lcd.print("Mode - USB Only");
  delay(2000);

  // Initialize readings array
  for (int i = 0; i < MAX_READINGS; i++) {
    readings[i] = {0, 0, 0, 0};
  }

  Serial.println("SafeBite Manual Mode Started");
  Serial.println("Sensors active - no WiFi required");
  Serial.println("Data stored locally for later upload");
}

void storeReading(float temp, float hum, int gas) {
  readings[currentIndex].temperature = temp;
  readings[currentIndex].humidity = hum;
  readings[currentIndex].gas = gas;
  readings[currentIndex].timestamp = millis();
  
  currentIndex = (currentIndex + 1) % MAX_READINGS;
  if (readingCount < MAX_READINGS) {
    readingCount++;
  }
}

void displayReading(float temp, float hum, int gas) {
  // LCD Display
  lcd.setCursor(0, 0);
  lcd.print("Gas:");
  lcd.print(gas);
  lcd.print("    ");

  lcd.setCursor(0, 1);
  if (gas > 400) {
    digitalWrite(LED, HIGH);
    digitalWrite(Buzzer, HIGH);
    lcd.print("GAS Detected!  ");
  } else {
    digitalWrite(LED, LOW);
    digitalWrite(Buzzer, LOW);
    lcd.print("T:");
    lcd.print(temp, 1);
    lcd.print("C H:");
    lcd.print(hum, 0);
    lcd.print("% ");
  }

  // Serial Output
  Serial.print("Reading #"); Serial.print(readingCount);
  Serial.print(" | Gas: "); Serial.print(gas);
  Serial.print(" | Temp: "); Serial.print(temp);
  Serial.print(" | Hum: "); Serial.println(hum);
}

void printStoredData() {
  Serial.println("\n=== STORED SENSOR DATA ===");
  Serial.println("Format: Reading# | Timestamp | Temp | Humidity | Gas");
  
  for (int i = 0; i < readingCount; i++) {
    Serial.print("Reading "); Serial.print(i + 1);
    Serial.print(" | "); Serial.print(readings[i].timestamp);
    Serial.print(" | "); Serial.print(readings[i].temperature);
    Serial.print(" | "); Serial.print(readings[i].humidity);
    Serial.print(" | "); Serial.println(readings[i].gas);
  }
  
  Serial.println("=== END DATA ===");
}

void loop() {
  if (millis() - lastReading > READING_INTERVAL) {
    // Read sensors
    int gasValue = analogRead(Sensor);
    sensors.requestTemperatures();
    float dsTemp = sensors.getTempCByIndex(0);
    float h = dht.readHumidity();

    // Store reading
    storeReading(dsTemp, h, gasValue);
    
    // Display reading
    displayReading(dsTemp, h, gasValue);
    
    lastReading = millis();
  }

  // Print stored data every 60 readings (5 minutes)
  if (readingCount > 0 && readingCount % 60 == 0) {
    printStoredData();
  }

  delay(1000); // Check every second
}
