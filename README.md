[See it Live](http://github.com) - this is the JS demonstration, used best with Firefox v25+ on an Android device

***
###Purpose
Demonstration of mashing up the basic map resource with all the latest sensory awareness from an HTML5 device

***
###Overview
This demonstration involves two parts:<br>

**USER INTERFACE**

* Emphasis of this project was on demonstration of the capabilities in a modern UI framework
* An attempt to push the limits of a web browser, JavaScript, and HTML5
* Where JS/HTML5/Browsers fell short, a demonstration of a Native-built app was used  
**HTML5 elements used:**
* [getUserMedia/Stream API](http://caniuse.com/stream)
* [Geolocation API](http://caniuse.com/geolocation)
* [DeviceOrientation API](http://caniuse.com/deviceorientation)
* [CSS Transforms API](http://caniuse.com/transforms2d)  
**JavaScript Frameworks used:**
* [ArcGIS JS API](http://js.arcgis.com)  
**Browsers used:**
* Chrome for Mac, Windows, iOS, Android
* Firefox for Mac, Windows, Android
* note that Firefox(beta) for Android was the only device usable with all HTML5 APIs  
**Native App:**
* [ObjectiveC / iOS](https://github.com/lukepatrick/MapCompassCamera)


**DATA SOURCES**

* The main REST resource used is the demo is the publically available  [ArcGIS Labels/Reference MapService](http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer)
* Other data sources are the sensory awareness of the device used
* GPS signals for position
* GPS/Accelerometers for bering
* Camera/Media feed for reality as the backdrop


###Technical Details

**HTML**  
```html
<body bgcolor="000">
	<div>
		<section id="app" hidden>
			<div class="container">
			<span id="live"><div id="map"></div> </span>
			<video id="monitor" autoplay></video>
			</div>
		</section>
	</div>
</body>
```


**Geolocation**  
```javascript
// check if geolocaiton is supported
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
		// retrieve update about the current geographic location of the device
		watchId = navigator.geolocation.watchPosition(showLocation, locationError);
	} else {
		alert("Browser doesn't support Geolocation. Visit http://caniuse.com to discover browser support for the Geolocation API.");
	}
```

**Orient**  
```javascript
function orientationChangeHandler() {
	// An event handler for device orientation events sent to the window.
	orientationHandle = on(window, "deviceorientation", onDeviceOrientationChange);
	// The setInterval() method calls rotateMap at specified intervals (in milliseconds).
	renderingInterval = setInterval(rotate, 100);
}
```

**Rotate Map**  
```javascript
if (has('ff')) {
	var updatedAngle = Angle;
	dom.byId("map").style.MozTransform = "rotate(0deg)";
	dom.byId("map").style.MozTransform = "rotate(" + updatedAngle + "deg)";
}
```

**getUserMedia for the proper browser**  
```javascript
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
 
//Then execute getUserMedia:  

navigator.getUserMedia({
	video : true,
	audio : false}, 
	function(localMediaStream) {
		var video = document.getElementById('monitor');
		video.addEventListener('click', changeFilter, false);
		video.src = window.URL.createObjectURL(localMediaStream);
	}, 
	onFail
);
```

