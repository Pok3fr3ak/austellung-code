int lastVal = -1;

void setup() {
  Serial.begin(9600); // 9600 BAUD
}

// runs really really fast...
void loop() {
	  
	  // Analog IN 6
    int currentVal = map(analogRead(A5), 0, 1023, 0, 127); // MIDI CC 7 BIT
    if (currentVal != lastVal)
    {
      lastVal = currentVal;
	    // only send DELTA
	    // sends integer as string non-padded
      Serial.print("A5_");
      Serial.print(currentVal);
      Serial.println();
      delay(10); // "pseudo-throttle"
    }
}
