var five = require("johnny-five"),
board = new five.Board();
board.on("ready", function() {

  // Define the variables needed in the program
  var bl = new five.Button("A0"); // define the left button
  var br = new five.Button("A1"); // define the right button
  var sl = 0;  // keeps score for the player on the left
  var sr = 0;  // keeps score for the player on the right

  var i = 0;
  var waittime = 0;
  var charIndex = 0;

  // This Boolean variable is used to allow only the first player
  // that presses the button for each new character displayed
  var play = false;

  // Setup the LCD screen using the I2C interface
  lcd = new five.LCD({
    controller: "PCF8574"
  });

  // Tell the LCD you will use these special characters
  //  We're using an array of JSON fragments
  var chars = [
    { name: "runninga",
      code: ":runninga:",
      score: -3,
      msg: "Killed the hunter" },
    { name: "runningb",
      code: ":runningb:",
      score: 1,
      msg: "Hunter escaped" },
    { name: "heart",
      code: ":heart:",
      score: 1,
      msg: "  +1 point      " },
    { name: "duck",
      code: ":duck:",
      score: 3,
      msg: "  +3 points       " },
    { name: "cent",
      code: ":cent:",
      score: -5,
      msg: "BOOM -5 points " }
  ];


  // Setup the special characters
  for (var c=0; c<chars.length; c++ ) {
    lcd.useChar(chars[c].name);
  }
  lcd.clear().cursor(1,0).print("Game time!");
  execute(1000);

  function execute(duration) {
    lcd.clear();
    duration = Math.round(Math.random()*2000);
    charIndex = Math.round(Math.random()*4);
    i++;
    if ( charIndex < 5 ) {
      play = true;
      lcd.cursor(0,8).print(chars[charIndex].code);
    }
    console.log('loop:' + i + ' duration ' + duration + 'ms char:' + charIndex + '/' + chars.length);
    board.wait(duration, function() {
      execute(duration);
    });
  }

  // left button pressed
  bl.on("press", function() {
    if ( play ) { sl = sl + chars[charIndex].score; }
    play = false;
    console.log('left button pressed ' + waittime + " score:" + sl + " play:" + play);
    lcd.cursor(0,0).print("    ");
    lcd.cursor(0,0).print(sl);
    lcd.cursor(1,0).print(chars[charIndex].msg);
  });

  // right button pressed
  br.on("press", function() {
    if ( play ) { sr = sr + chars[charIndex].score; }
    play = false;
    console.log('right button pressed ' + waittime + " score:" + sr + " play:" + play);
    lcd.cursor(0,13).print("   ");
    lcd.cursor(0,13).print(sr);
    lcd.cursor(1,0).print(chars[charIndex].msg);
  });

});
