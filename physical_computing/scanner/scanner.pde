import mqtt.*;
MQTTClient client;

import processing.serial.*;
Serial scannerSerialPort;  // Create object from Serial class
String scannerSerialVal;   // Data received from the serial port
String scannerSerialVal2;  // Data received from the serial port

String input = "";

int buttonCancel = 1;
int buttonYes = 2;
int buttonNo = 3;
int buttonState = 4;

int prevState = 99;
int state = 100;

    // states: 100: start
    //         200: scanned
    //         301: question 1
    //         302: question 2
    //         303: question 3
    //         304: question 4
    //         400: results
    //         500: done

int prevEthicLevel = 1;
int ethicLevel = 1;
int inputLength = 8;
int prevQuestion = 99;
int question = 0;
String results = "";

String[][] questions = {
  {"1-1: Soll ich das Fleisch wegwerfen, wenn es einen Tag über dem Ablaufdatum ist?",
   "1-2: Stammt das Fleisch von einem einzelnen Tier? Falls nicht, von wie vielen stammt es?",
   "1-3: Von welcher Stelle des Tierkörpers wurde das Fleischstück herausgeschnitten?",
   "1-4: Kann ich bedenkenlos Fleisch kaufen, wenn es Schweizer Fleisch ist?"},
  {"2-1: Wird Biofleisch auf die gleiche Art geschlachtet wie nicht-bio Fleisch?",
   "2-2: Wurde das Tier mit Nahrung gefüttert, das auch in der Schweiz produziert wurde?",
   "2-3: Wurden den Tieren Antibiotika verabreicht und hat dies schlussendlich gesundheitliche Konsequenzen für mich?",
   "2-4: Hat der Bauernhof, auf dem das Tier aufgewachsen ist wirklich so schön ausgesehen? Könnte man diesen einmal besuchen?"},
  {"3-1: Wie glücklich was das Tier zum Zeitpunkt, wo es geschlachtet wurde? Hat das Fleisch eine bessere Qualität, wenn das Tier glücklich gestorben ist?",
   "3-2: Gibt es Teile des Tieres, die nicht verwendet wurden? Wenn ja, können Sie mir sagen welche?",
   "3-3: Sollte jeder wöchentlich einen fleischfreien Tag einlegen, so dass jährlich 157 Millionen Tiere vor der Schlachtbank verschont werden?",
   "3-4: Entstehen bei der Tieraufzucht und Fleischverarbeitung nicht deutlich mehr Treibhausgase als bei der Herstellung anderer Gerichte?"},
  {"4-1: Ist es ethisch, ein Tier zu töten, nur weil es Spass macht Fleisch zu essen?",
   "4-2: Ist es ethisch, dass der durchschnittliche Europäer jährlich 4 Kühe oder Kälber, 4 Schafe, 12 Gänse, 37 Enten, 46 Truthähne, 46 Schweine und 945 Hühner isst?",
   "4-3: Gehört es zum guten Leben eines Schweines, einmal gegessen zu werden?",
   "4-4: Wollte das Tier von diesem Siedfleisch einmal gegessen werden?"}
 };


void setup() {
  client = new MQTTClient(this);
  client.connect("mqtt://86241baa:660d67a40f0bfa38@broker.shiftr.io", "processing");
  // client.subscribe("/ethical-scanner");
  // client.unsubscribe("/ethical-scanner");

  client.publish("/ethic-level", str(ethicLevel));
  client.publish("/state", str(state));
  client.publish("/results", results);

  // I know that the first port in the serial list on my mac
  // is Serial.list()[0].
  // On Windows machines, this generally opens COM1.
  // Open whatever port is the one you're using.
  String scannerSerialPortName = Serial.list()[1]; //change the 0 to a 1 or 2 etc. to match your port
  scannerSerialPort = new Serial(this, scannerSerialPortName, 9600);

  size(200, 600);
  println("setup: state: "+state);
  println("setup: input: "+input);
  println("You got that input length right?");
}

void draw() {
  if (prevEthicLevel != ethicLevel) {
    client.publish("/ethic-level", str(ethicLevel));
    prevEthicLevel = ethicLevel;

    if (state > 200 && state < 400) {
      client.publish("/questions", questions[(ethicLevel-1)][question]);
    }
  }

  if (prevState != state) {
    client.publish("/state", str(state));
    prevState = state;
    input = "";
    println("state: state: "+state);
  }

  if (state < 300) {
    results = "";
  }

  if (input.length() == inputLength && state == 100) {
    println("input: "+input);
    input = "";
    results = "";
    state = 200;
  }

  if (state > 200 && state < 400 && prevQuestion != question) {
    client.publish("/questions", questions[(ethicLevel-1)][question]);
    prevQuestion = question;
  }
}

void serialEvent (Serial scannerSerialPort) {
  int inByte = scannerSerialPort.read();

  // Check if one of the buttons is pressed
  if (inByte == buttonYes || inByte == buttonNo) {

  	// Check if we are in the state of scanned product and Yes has been pressed
    if (state == 200 && inByte == buttonYes) {
      println("Button pressed: Yes for state 200");
	  	// Go to questions
      state = 301;
      println("State changed to 301 after Yes for state 200");
    }

  	// If we are in the state range of the questions
    else if (state > 300 && state < 400) {

    	// Publish a Yes as anwser and save it to the results string
	    if (inByte == buttonYes) {
	      client.publish("/answer", "Yes");
	      results += "Frage: " + questions[(ethicLevel-1)][question] + "<br> Ethik-Level " + ethicLevel + "– Yes<br><br>";
	      println("Button pressed and result saved: Yes");

    	// Publish a No as anwser and save it to the results string
	    } else if (inByte == buttonNo) {
	      client.publish("/answer", "No");
	      results += "Frage: " + questions[(ethicLevel-1)][question] + "<br> Ethik-Level " + ethicLevel + "– No<br><br>";
	      println("Button pressed and result saved: No");
	    }
	  }

  	// Publish the results if we've arrived the last question
    if (state == 304) {
      client.publish("/results", results);
      println("Results submitted after Yes");
    }

  	// Increase question number if we havn't arrived the last one
  	if (state > 300 && state <= 303) {
      question = question + 1;
      println("Question increased by one");

      state = state + 1;
      println("State increased by one");
  	}

  	// Reset question number and go to next state if we've arrived the last question
  	else if (state == 304) {
      question = 0;
      state = 400;
    }

  	// Jump to next state if button is pressed on results view
    else if (state == 400) {
      state = 500;
    }

  	// Jump to start if button is pressed on done view
    else if (state == 500) {
      state = 100;
    }

  	// Apologize else
    else {
      println("Yes or No buttons not matching condition!");
    }

  } else if (inByte == 10) {
    ethicLevel = 1;
  } else if (inByte == 20) {
    ethicLevel = 2;
  } else if (inByte == 30) {
    ethicLevel = 3;
  } else if (inByte == 40) {
    ethicLevel = 4;
  } else {
    println("All I have for inByte is: "+inByte);
  }
}

void keyPressed () {
  if (key != '\n' && key != CODED && state == 100) {
    input += key;
  }
}

void messageReceived(String topic, byte[] payload) {
  println("new message: " + topic + " - " + new String(payload));
}
