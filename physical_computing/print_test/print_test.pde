/**
* One Frame.
*
* Saves one PDF with the contents of the display window.
* Because this example uses beginRecord, the image is shown
* on the display window and is saved to the file.
*/

import processing.pdf.*;

boolean printRecord = true;

void setup() {
	size(600, 600);
}

void draw() {
	if (printRecord) {
		beginRecord(PDF, "./print-folder/line.pdf");
	}

	background(255);
	stroke(0, 20);
	strokeWeight(20.0);
	line(200, 0, 400, height);

	if (printRecord) {
		endRecord();
		printRecord = false;
	}
}
