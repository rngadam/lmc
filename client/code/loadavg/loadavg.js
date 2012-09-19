// Client Code

console.log('loadavg load');

function createLoadGauge(id) {
	var myGauge = new jGauge(); // Create a new jGauge.
	myGauge.id = id; // Link the new jGauge to the placeholder DIV.
	myGauge.autoPrefix = autoPrefix.si; // Use SI prefixing (i.e. 1k = 1000).
	myGauge.imagePath = 'img/jgauge_face_taco.png';
	myGauge.segmentStart = -225
	myGauge.segmentEnd = 45
	myGauge.width = 170;
	myGauge.height = 170;
	myGauge.needle.imagePath = 'img/jgauge_needle_taco.png';
	myGauge.needle.xOffset = 0;
	myGauge.needle.yOffset = 0;
	myGauge.label.yOffset = 55;
	myGauge.label.color = '#fff';
	myGauge.label.precision = 1; 
	myGauge.label.suffix = ''; 
	myGauge.ticks.labelRadius = 45;
	myGauge.ticks.labelColor = '#0ce';
	myGauge.ticks.start = 0.1;
	myGauge.ticks.end = 1;
	myGauge.ticks.count = 7;
	myGauge.ticks.color = 'rgba(0, 0, 0, 0)';
	myGauge.range.color = 'rgba(0, 0, 0, 0)';
	return myGauge;							
}	

function updateGauge() {
	ss.rpc('system.loadavg', function(res) {
		one.setValue(res.one);
		five.setValue(res.five);
		fifteen.setValue(res.fifteen);
	});
}
	
var one = createLoadGauge('one');
var five = createLoadGauge('five');
var fifteen = createLoadGauge('fifteen');

console.log('init gauge');
one.init();
five.init();
fifteen.init();

setInterval(updateGauge, 1000);