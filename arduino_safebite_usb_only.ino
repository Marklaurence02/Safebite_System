#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

// Pins
#define LED 2
#define Buzzer 3
#define Sensor A1
#define ONE_WIRE_BUS 7
#define DHTPIN 6
#define DHTTYPE DHT11

// Sensors
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DHT dht(DHTPIN, DHTTYPE);

// Data storage for later upload
struct SensorData {
  float temperature;
  float humidity;
  int gas;
  unsigned long timestamp;
};

SensorData lastReadings[10];
int readingIndex = 0;
int totalReadings = 0;

void setup() {
  Serial.begin(9600);

  lcd.init();
  lcd.backlight();
  pinMode(LED, OUTPUT);
  pinMode(Buzzer, OUTPUT);

  sensors.begin();
  dht.begin();

  // Display startup message
  lcd.setCursor(0, 0);
  lcd.print("SafeBite USB Only");
  lcd.setCursor(0, 1);
  lcd.print("Sensors Active");
  delay(2000);

  Serial.println("=== SafeBite USB Only Mode ===");
  Serial.println("Sensors: Temperature, Humidity, Gas");
  Serial.println("WiFi: Disabled (USB power only)");
  Serial.println("Data: Stored locally for manual upload");
  Serial.println("=====================================");
}

void storeReading(float temp, float hum, int gas) {
  lastReadings[readingIndex].temperature = temp;
  lastReadings[readingIndex].humidity = hum;
  lastReadings[readingIndex].gas = gas;
  lastReadings[readingIndex].timestamp = millis();
  
  readingIndex = (readingIndex + 1) % 10;
  totalReadings++;
}

void displayOnLCD(float temp, float hum, int gas) {
  // Clear LCD and display current readings
  lcd.clear();
  
  // First line: Gas level
  lcd.setCursor(0, 0);
  lcd.print("Gas:");
  lcd.print(gas);
  lcd.print("    ");
  
  // Second line: Temperature and Humidity
  lcd.setCursor(0, 1);
  if (gas > 400) {
    digitalWrite(LED, HIGH);
    digitalWrite(Buzzer, HIGH);
    lcd.print("GAS DETECTED!");
  } else {
    digitalWrite(LED, LOW);
    digitalWrite(Buzzer, LOW);
    lcd.print("T:");
    lcd.print(temp, 1);
    lcd.print("C H:");
    lcd.print(hum, 0);
    lcd.print("%");
  }
}

void printToSerial(float temp, float hum, int gas) {
  Serial.print("Reading #"); Serial.print(totalReadings);
  Serial.print(" | Gas: "); Serial.print(gas);
  Serial.print(" | Temp: "); Serial.print(temp, 1);
  Serial.print("°C | Humidity: "); Serial.print(hum, 0);
  Serial.print("% | Time: "); Serial.print(millis() / 1000);
  Serial.println("s");
}

void printStoredData() {
  Serial.println("\n=== LAST 10 READINGS ===");
  Serial.println("Format: # | Gas | Temp | Humidity | Time(s)");
  
  for (int i = 0; i < 10; i++) {
    int idx = (readingIndex - 1 - i + 10) % 10;
    if (lastReadings[idx].timestamp > 0) {
      Serial.print("#"); Serial.print(totalReadings - i);
      Serial.print(" | "); Serial.print(lastReadings[idx].gas);
      Serial.print(" | "); Serial.print(lastReadings[idx].temperature, 1);
      Serial.print("°C | "); Serial.print(lastReadings[idx].humidity, 0);
      Serial.print("% | "); Serial.print(lastReadings[idx].timestamp / 1000);
      Serial.println("s");
    }
  }
  Serial.println("========================");
}

void loop() {
  // Read sensors
  int gasValue = analogRead(Sensor);
  sensors.requestTemperatures();
  float dsTemp = sensors.getTempCByIndex(0);
  float h = dht.readHumidity();

  // Store the reading
  storeReading(dsTemp, h, gasValue);
  
  // Display on LCD
  displayOnLCD(dsTemp, h, gasValue);
  
  // Print to Serial Monitor
  printToSerial(dsTemp, h, gasValue);
  
  // Print stored data every 10 readings
  if (totalReadings % 10 == 0) {
    printStoredData();
  }
  
  // Check for gas alarm
  if (gasValue > 400) {
    Serial.println("!!! GAS ALARM - HIGH LEVEL DETECTED !!!");
  }
  
  delay(5000); // Read every 5 seconds
}
