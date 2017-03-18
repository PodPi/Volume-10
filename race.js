// This game relates to PodPi Volume 10, page 11
// The goal of the game is to push your opponent of 
// the LCD screen.
//
var five = require("johnny-five"),
board = new five.Board();

board.on("ready", function() {

  // define the input controllers
  var left  = new five.Button("A0");
  var right = new five.Button("A1");
  
  // define some local variables
  var row  = 1;
  var col  = 8;
  var play = true;

  // setup the LCD display (using I2C)
  lcd = new five.LCD({
    controller: "PCF8574"
  });

  // define the special characters
  lcd.useChar("runninga");
  lcd.useChar("runningb");
  
  // get ready to play
  lcd.clear();
  lcd.cursor(0, 2).print("Ready to play");
  this.wait(3000, function() {
    lcd.clear().cursor(0, 6).print("GO!!!");
  });

  // left button released
  left.on("release", function() {
    if ( play ) col--;
    if ( col < 0 ) {
      lcd.clear().cursor(0,1).print("Player A wins!");
      play = false;
    } else {
      lcd.clear().cursor(row,col).print(":runninga:");
    }
  });

  // right button released
  right.on("release", function() {
    if ( play ) col++;
    if (col > 16 ) {
      lcd.clear().cursor(1,1).print("Player B wins!");
      play = false;
    } else {
      lcd.clear().cursor(row,col).print(":runningb:");
    }
  });
});
