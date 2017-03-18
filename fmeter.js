var five = require("johnny-five"),
board = new five.Board();

board.on("ready", function() {

  // define the sensor
  var ne555  = new five.Sensor("A2");
  // count each cycle change
  var count  = 0;

  var cTime  = 0;  // current time
  var pTime  = 0;  // previous time
  var dTime  = 0;  // delata time

  lcd = new five.LCD({
    controller: "PCF8574"
  });

  lcd.cursor(0, 2).print("Ready to measure!");
  this.wait(3000, function() {
    lcd.clear();
  });

  ne555.on("change", function() {
    if ( this.value > 700 ) {
      cTime = hr2sec(process.hrtime());
      dTime = cTime - pTime;
      // calculate the frequency
      var f = Math.round(1000000/dTime*10)/10;
      lcd.cursor(0,0).print('Counter: ' + count++);
      lcd.cursor(1,0).print('F='+ f + 'Hz t=' + Math.round(dTime/1000) + 'ms  ');
      pTime = cTime;
    }

  });

  // convert system time into microseconds
  function hr2sec(time) {
    var mtime = time[0] * 1000000 + time[1] / 1000;
    //console.log('transformed=' + mtime);
    return mtime;
  };

});
