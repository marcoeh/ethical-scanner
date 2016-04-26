#include <Bounce2.h>

#define BUTTON_PIN_1 2
#define BUTTON_PIN_2 3
#define BUTTON_PIN_3 4

boolean buttonState1 = false;
boolean lastButtonState1 = false;
boolean buttonState2 = false;
boolean lastButtonState2 = false;
boolean buttonState3 = false;
boolean lastButtonState3 = false;

// Instantiate a Bounce object
Bounce debouncer1 = Bounce();
Bounce debouncer2 = Bounce();
Bounce debouncer3 = Bounce();

void setup() {
  Serial.begin(9600);

  pinMode(BUTTON_PIN_1,INPUT_PULLUP);
  debouncer1.attach(BUTTON_PIN_1);
  debouncer1.interval(5); // interval in ms

  pinMode(BUTTON_PIN_2,INPUT_PULLUP);
  debouncer2.attach(BUTTON_PIN_2);
  debouncer2.interval(5); // interval in ms

  pinMode(BUTTON_PIN_3,INPUT_PULLUP);
  debouncer3.attach(BUTTON_PIN_3);
  debouncer3.interval(5); // interval in ms
}

void loop() {
  // Update the Bounce instances :
  debouncer1.update();
  debouncer2.update();
  debouncer3.update();

  // Get the updated buttonValue :
  int buttonValue1 = debouncer1.read();
  int buttonValue2 = debouncer2.read();
  int buttonValue3 = debouncer3.read();

  // Turn on the LED if either button is pressed :
  if (buttonValue1 == LOW && lastButtonState1 == false) {
    Serial.write(1);
    buttonState1 = true;
    lastButtonState1 = true;
  } else if (buttonValue1 == HIGH && buttonState1 == true) {
    buttonState1 = false;
    lastButtonState1 = false;
  } else if (buttonValue2 == LOW && lastButtonState2 == false) {
    Serial.write(2);
    buttonState2 = true;
    lastButtonState2 = true;
  } else if (buttonValue2 == HIGH && buttonState2 == true) {
    buttonState2 = false;
    lastButtonState2 = false;
  } else if (buttonValue3 == LOW && lastButtonState3 == false) {
    Serial.write(3);
    buttonState3 = true;
    lastButtonState3 = true;
  } else if (buttonValue3 == HIGH && buttonState3 == true) {
    buttonState3 = false;
    lastButtonState3 = false;
  }

  int potiValue = analogRead(A1);
  if (potiValue <= 256) {
    Serial.write(10);
  } else if (potiValue > 256 && potiValue <= 512) {
    Serial.write(20);
  } else if (potiValue > 512 && potiValue <= 768) {
    Serial.write(30);
  } else if (potiValue > 768 && potiValue <= 1024) {
    Serial.write(40);
  }
}

