// Client Code

console.log('sparklines');

var myvalues = [];
//var myvalues = [10,8,5,7,4,4,1];
//$('.dynamicsparkline').sparkline(myvalues);

function updateGauge() {
  ss.rpc('system.loadavg', function(res) {
    myvalues.push(res.one);
    if (myvalues.length > 60)
      myvalues.shift();
    $('.dynamicsparkline').sparkline(myvalues);
  });
}

setInterval(updateGauge, 1000);
