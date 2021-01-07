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

      // these calls block execution until data has been sent
      Serial.print("A5_");
      Serial.print(currentVal);
      Serial.println();

      // unclear if this is needed at all, let us find out
      delay(10); // "pseudo-throttle"
    }
}
