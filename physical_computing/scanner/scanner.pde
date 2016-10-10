int sizeWidth = 2100;
int sizeHeight = 1480;

import mqtt.*;
MQTTClient client;

import processing.serial.*;
Serial scannerSerialPort;  // Create object from Serial class
String scannerSerialVal;   // Data received from the serial port
String scannerSerialVal2;  // Data received from the serial port

import processing.pdf.*;
boolean printRecord = false;

String input = "";

// Our productBarCodes A, B and C
String[] productBarCodes = {"7610200382849", "9763671227480", "9527804670266"};
String[] productNames = {"Beefburger M-Budget (Zentralschlachthof)", "Hamburger vom Schlachthäuschen", "Hamburger vom Weideschlachtrind", "Nope"};
int product = 0;

// Our Letter Text
String letterTextIntroPre = "Frage betreffend ";
String letterTextAnrede = "Sehr geehrte Damen und Herren";
String letterTextMainPre = "Neulich habe ich ihr ";
String letterTextMainPost = " gekauft.";
String letterTextDanke = "Besten Dank für Ihre Rückmeldung.";
String letterTextGruss = "Mit freundlichen Grüssen,";

String[] letterQuestions = {};


//Addresses
String[][] addresses = {
	{"",
	 "",
	 "",
	 ""},
	{"",
	 "",
	 ""},
	{"",
	 "",
	 ""},
	{"",
	 "",
	 "",
	 ""}
 };

PFont walsheimRegular;
PFont walsheimBold;

int buttonCancel = 1;
int buttonYes = 2;
int buttonNo = 3;
int buttonState = 4;

int prevState = 99;
int state = 100;

/* states:	 100: start
			 200: scanned
			 301: question 1
			 302: question 2
			 303: question 3
			 304: question 4
			 400: results
			 500: done print
			 501: done noprint
*/

int prevEthicLevel = 1;
int ethicLevel = 1;
int inputLength = 13;
int prevQuestion = 99;
int question = 0;
String results = "";


// M-Budget-Produkt
String[][] questionsProductA = {
	// Ethic Level 1
	{"Soll ich billiges Fleisch  wegwerfen, wenn es einen Tag über dem Ablaufdatum ist?",
	 "Kann ich billiges Fleisch ohne Probleme entsorgen, wenn es mir nicht schmeckt?",
	 "Darf ich billigeres Fleisch eher wegwerfen als teures Fleisch?",
	 "Finden es die Rinder toll zusammen mit vielen Freunden zu Fleisch verarbeitet zu werden?"},
	// Ethic Level 2
	{"Stammt das Fleisch von einem einzelnen Tier? Von wie vielen stammt es?",
     "Hatte das Tier einen schlimmeren Tod, weil sein Fleisch weniger kostet?",
     "Was bedeutet besonders artgerechte Tierhaltung? Gilt das auch für die Zeit im Zentralschlachthof?",
     "Erkennt man es an der Fleischqualität, wenn das Tier Angst hatte?"},
	// Ethic Level 3
	{"Ist es in menschlich, dass die Tiere im grossen Schlachthof im Akkord geschlachtet werden?",
	 "Wie glücklich war das Tier zum Zeitpunkt, wo es im Zentralschlachthof geschlachtet wurde?",
	 "Kann die industrielle Fleischproduktion Tierfreundlich sein?",
	 "Entstehen bei der Tieraufzucht und Fleischverarbeitung durch grosse Schlachthäuser mehr Treibhausgase?"},
	// Ethic Level 4
	{"Macht es Sinn, immer nur Edelstücke zu essen und dafür viel mehr Tiere zu schlachten?",
	 "Gehört es zum guten Leben eines Rindes, einmal verspiesen zu werden?",
	 "Ist es ethisch, ein Tier zu töten, nur weil es Spass macht Fleisch zu essen?",
	 "Wollte das Tier in diesem Hamburger einmal im Zentralschlachthof geschlachtet werden?"}
 };

// Schlachthäuschen-Produkt
String[][] questionsProductB = {
	// Ethic Level 1
	{"Soll ich gutes Fleisch wegwerfen, wenn es einen Tag über dem Ablaufdatum ist?",
	 "Stammt das Fleisch von einem einzelnen Tier? Falls nicht, von wie vielen stammt es?",
	 "Darf ich so viel Fleisch essen, wie ich will, wenn ich es mir leisten kann?",
	 "Kann ich bedenkenlos Fleisch kaufen, wenn es aus einer kleinen Produktion stammt?"},

	// Ethic Level 2
	{"Erkennt man es an der Fleischqualität, wenn das Tier verunsichert war?",
	 "Kann ich bedenkenlos Fleisch kaufen, wenn es Biofleisch ist?",
	 "Wie viele Tiere werden an einem Tag im Schlachthäuschen geschlachtet?",
	 "Was bedeutet besonders artgerechte Tierhaltung, gilt das auch für die Fahrt zum Schlachthäuschen?"},

   // Ethic Level 3
	{"Gibt es Teile des Tieres, die nicht verwendet wurden? Welche sind das?",
	 "Gibt es essbare Teile des Tieres, die nach der Schlachtung im kleinen Schlachthäuschen weggeworfen wurden?",
	 "Ist es in Ordnung, dass die Tiere durch die Fahrt zum Schlachthäuschen einen grossen Stress haben?",
	 "Hat das Tier einen weniger grossen Stress vor dem Tod als in einem Zentralschlachthof?"},
	// Ethic Level 4
	{"Ist es ethisch, ein Tier zu töten, nur weil es Spass macht Fleisch zu essen?",
	 "Gehört es zum guten Leben eines Rindes, einmal im Schlachthäuschen zu sterben?",
	 "Sollte man den Tieren bei einer Schlachtung die Chance geben, sich zu verteidigen?",
	 "Macht es Sinn, immer nur Edelstücke zu essen und dafür viel mehr Tiere zu schlachten?"}
 };

// Weideschlachtung-Produkt
String[][] questionsProductC = {
	// Ethic Level 1
	{"Soll ich das Fleisch wegwerfen, wenn es einen Tag über dem Ablaufdatum ist?",
	 "Darf ich stressfrei geschlachtetes Fleisch ungestresst entsorgen, wenn es jemand angefasst hat?",
	 "Darf ich entspannt getötete Tiere unbewusst essen, weil ich das Geld dazu habe?",
	 "Kann ich bedenkenlos Fleisch kaufen, wenn es stressfrei geschlachtet wurde?"},
	// Ethic Level 2
	{"Darf ich exzessiv Fleisch konsumieren, wenn es einen stressfreien Tod hatte?",
	 "Erkennt man es an der Fleischqualität, ob das Tier entspannt war?",
	 "Wie viele Tiere werden an einem Tag bei einer Weideschlachtung geschlachtet?",
	 "Kann ich bedenkenlos Fleisch kaufen, wenn es Weiderind ist?"},
	// Ethic Level 3
	{"Ist es sinnvoll sehr viel Fleisch zu essen, wenn das Tier einen stressfreien Tod hatte?",
	 "Wie glücklich war das Tier zum Zeitpunkt, wo es geschlachtet wurde?",
	 "Entstehen bei der Tieraufzucht und Fleischverarbeitung von Weiderind Treibhausgase?",
	 "Gibt es essbare Teile des Tieres, die nach der Schlachtung weggeworfen wurden?"},
	// Ethic Level 4
	{"Ist es ethisch, ein Tier zu töten, nur weil es Spass macht Fleisch zu essen?",
	 "Gehört es zum guten Leben eines Rindes, einmal stressfrei geschlachtet zu werden?",
	 "Würde sich das Rind freuen, einen stressfreien Tod haben zu können und gegessen zu werden?",
	 "Wollte das Tier in diesem Hamburger einmal stressfrei geschlachtet werden?"}
 };

// questions to be deleted later
String[][] questions = {
	{"1-1",
	 "1-2",
	 "1-3",
	 "1-4"},
	{"2-1",
	 "2-2",
	 "2-3",
	 "2-4"},
	{"3-1",
	 "3-2",
	 "3-3",
	 "3-4"},
	{"4-1",
	 "4-2",
	 "4-3",
	 "4-4"}
 };

// questions to be deleted later
String[][] questionsDefault = {
	{"1-1",
	 "1-2",
	 "1-3",
	 "1-4"},
	{"2-1",
	 "2-2",
	 "2-3",
	 "2-4"},
	{"3-1",
	 "3-2",
	 "3-3",
	 "3-4"},
	{"4-1",
	 "4-2",
	 "4-3",
	 "4-4"}
 };


void setup() {
	client = new MQTTClient(this);
	client.connect("mqtt://86241baa:660d67a40f0bfa38@broker.shiftr.io", "processing");
	// client.subscribe("/ethical-scanner");
	// client.unsubscribe("/ethical-scanner");

	// client.publish("/ethic-level", str(ethicLevel));
	// client.publish("/state", str(state));
	// client.publish("/results", results);
	// client.publish("/product", productNames[product]);
	// client.publish("/address", str(address));

	// I know that the first port in the serial list on my mac
	// is Serial.list()[0].
	// On Windows machines, this generally opens COM1.
	// Open whatever port is the one you're using.
	String scannerSerialPortName = Serial.list()[1]; //change the 0 to a 1 or 2 etc. to match your port
	scannerSerialPort = new Serial(this, scannerSerialPortName, 9600);

	size(2100, 1480);
	background(255);
	println("setup: state: "+state);
	println("setup: input: "+input);
	println("You got that input length right?");

	walsheimRegular = createFont("GTWalsheimProRegular", 38);
	walsheimBold = createFont("GTWalsheimProBold", 38);
	textFont(walsheimRegular);
}

void draw() {

	if (prevEthicLevel != ethicLevel && state < 300) {
		client.publish("/ethic-level", str(ethicLevel));
		prevEthicLevel = ethicLevel;

		// if (state > 200 && state < 400) {
		// 	client.publish("/questions", questions[(ethicLevel-1)][question]);
		// }
	}

	if (prevState != state) {
		client.publish("/state", str(state));
		prevState = state;
		input = "";
		println("state: "+state);
	}

	if (state < 300) {
		results = "";
	}

	if (input.length() == inputLength && state == 100) {
		if (input.equals(productBarCodes[0])) {
			product = 0;
			questions = questionsProductA;
		} else if (input.equals(productBarCodes[1])) {
			product = 1;
			questions = questionsProductB;
		} else if (input.equals(productBarCodes[2])) {
			questions = questionsProductC;
			product = 2;
		} else {
			questions = questionsDefault;
			product = 3;
		}
		println("input: "+input);
		input = "";
		results = "";
		printRecord = false;
		client.publish("/product", productNames[product]);
		client.publish("/sounds", "yep");

		for (int i = 0; i < addresses[product].length; ++i) {
			client.publish("/address", addresses[product][i]);
		}

		state = 200;
	}

	if (state > 200 && state < 400 && prevQuestion != question) {
		client.publish("/questions", questions[(ethicLevel-1)][question]);
		prevQuestion = question;
	}

	if (printRecord) {
		drawDefault();
		printRecord = false;
	}
}

void serialEvent (Serial scannerSerialPort) {
	int inByte = scannerSerialPort.read();

	// Check if one of the buttons is pressed
	if (inByte == buttonYes || inByte == buttonNo) {


		// If we are in the state range of the questions
		if (state > 300 && state < 400) {

			// Publish a Yes as anwser and save it to the results string
			if (inByte == buttonYes) {
				client.publish("/answer", "Yes");
				results += "Frage: " + questions[(ethicLevel-1)][question] + "<br> Ethik-Level " + ethicLevel + "– Yes<br><br>";
				letterQuestions = append(letterQuestions, questions[(ethicLevel-1)][question]);
				println("Button pressed and result saved: Yes");

			// Publish a No as anwser and save it to the results string
			} else if (inByte == buttonNo) {
				client.publish("/answer", "No");
				//results += "Frage: " + questions[(ethicLevel-1)][question] + "<br> Ethik-Level " + ethicLevel + "– No<br><br>";
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
		else if (state == 400 && inByte == buttonYes) {
			println("Drucken!");
			printRecord = true;
			state = 500;
		}

		else if (state == 400 && inByte == buttonNo) {
			println("Nicht drucken!!");
			state = 501;
		}

		// Jump to start if button is pressed on done view
		else if (state >= 500 && inByte == buttonYes) {
			state = 100;
		}
		// Jump to start if button is pressed on done view
		else if (state >= 500 && inByte == buttonNo) {
			state = 100;
		}

		// Check if we are in the state of scanned product and Yes has been pressed
		else if (state == 200 && inByte == buttonYes) {
			println("Button pressed: Yes for state 200");
			// Go to questions
			state = 301;
			println("State changed to 301 after Yes for state 200");
		}

		// Apologize else
		else {
			client.publish("/state", "sorry");
			println("Yes or No buttons not matching condition!");
		}

		delay(300);

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

void drawDefault() {
	println("drawing");
	println("printRecord: "+printRecord);

	background(255);
	noFill();
	stroke(0);

	// Draw Absender
	line(60, (sizeHeight-10), 1220, (sizeHeight-10));
	line(60, (sizeHeight-110), 1220, (sizeHeight-110));
	line(60, (sizeHeight-210), 1220, (sizeHeight-210));
	line(1300, 60, 1300, (sizeHeight-10));

	rect((sizeWidth-210), 10, 200, 300);

	// textSize(16);
	// textMode(SHAPE);
	fill(0);

	String letterTextIntro = letterTextIntroPre;
	letterTextIntro += productNames[product];

	String letterTextMain = letterTextMainPre;
	letterTextMain += productNames[product];
	letterTextMain += letterTextMainPost;

	textFont(walsheimBold);

	text(letterTextIntro, 60, 40, 1200, 200);

	textFont(walsheimRegular);

	text(letterTextAnrede, 60, 200, 1200, 200);

	letterTextMain += " Dazu konnte ich folgende Fragen nicht beantworten:";
	text(letterTextMain, 60, 300, 1200, 200);

	String questionsAll = "";

	for (int i = 0; i < letterQuestions.length; ++i) {
		questionsAll += letterQuestions[i];
		questionsAll += " ";
	}

	letterQuestions = new String[0];

	text(questionsAll, 60, 480, 1200, 1000);


	text(letterTextDanke, 60, 1060, 1200, 200);
	text(letterTextGruss, 60, 1120, 1200, 200);

	int addressPosition = 900;

	// println("addresses[product][0]: "+addresses[product][0]);
	for (int i = 0; i < addresses[product].length; ++i) {
		text(addresses[product][i], 1440, addressPosition, 800, 200);
		addressPosition += 40;
	}

	save("./print-hotfolder/export.png");
}
