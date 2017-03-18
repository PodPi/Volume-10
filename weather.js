var five = require("johnny-five");
var https = require("https");
board = new five.Board();
board.on("ready", function() {

  // =========================
  // UPDATE YOUR ZIP CODE HERE
     var zipcode = 95661;
  // =========================

  // Define the variables needed in the program
  var bl = new five.Button("A0"); // define the left button

  // Setup the LCD screen using the I2C interface
  lcd = new five.LCD({
    controller: "PCF8574"
  });

  var wjson;
  var rec=0;

  https.get('https://x1xjhh45jj.execute-api.us-west-1.amazonaws.com/prod/owm?zip_code=' + zipcode,
      function(res) {
        res.on('data', function(chunk) {
            wjson = JSON.parse(chunk);
            console.log(wjson);
            var city = wjson.name;
            var weather = wjson.weather[0].description;
            lcd.clear().print('Weather for...');
            lcd.clear().cursor(1,0).print(city);

            var data = [ 'City Name', wjson.name,
                         'Weather', wjson.weather[0].description,
                         'Temperature', Math.round(9/5*(wjson.main.temp - 273) + 32) + 'F',
                         'Wind [speed, deg]', wjson.wind.speed + ', ' + wjson.wind.deg,
                         'Pressure, humidity', wjson.main.pressure + ", " + wjson.main.humidity,
                       ];

            setInterval(function() {
               console.log('rec=' + rec);
               if (rec+1 > data.length ) rec = 0;
               display(data,rec);
            },3000);

        });
    });

  var display = function(d,i){
        console.log(d[i] + ' is ' + d[i+1]);
        lcd.clear().print(d[i]);
        lcd.cursor(1,0).print(d[i+1]);
        rec=rec+2;
  };

});
