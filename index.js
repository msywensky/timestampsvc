var express = require('express');
var app = express();
var path = require('path');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:dtstr', function(request, response) {
  var dtstr = request.params.dtstr;

  if (isNumeric(dtstr)) {
    console.log("multiplying by 1000")
    dtstr = dtstr * 1000;
  } else {
    dtstr = dtstr + " UTC";
  }

  var result = { unix: null, natural: null};
  try {
    if (isDate(dtstr)) {
      var dt = new Date(dtstr);
      var natural =getNatural(dt);
      result = { unix: dt.getTime()/1000, natural: natural};
    }
    response.send(result);

  } catch(err) {
    console.log("failed:" + err);
    response.send(result);
  }

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var isDate = function(date) {
    return ( (new Date(date) !== "Invalid Date" && !isNaN(new Date(date)) ));
}

var isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var getNatural = function(d) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return getMonthStr(d.getUTCMonth()) + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear();
}

var getMonthStr = function(month) {
  return ['January','February', 'March', 'April', 'May','June',
  'July','August','September','October','November','December'][month];
}
