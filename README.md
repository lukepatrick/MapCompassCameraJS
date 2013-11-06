MapCompassCameraJS
==================

An "augmented reality" attempt, mashing up the mobile Camera with a Map and using the compass/GPS to force the map to lock to your position, all in HTML5/JS


 [http://www.github.com See it Live!] - this is the JS demonstration, used best with Firefox v25+ on an Android device<hr><br>

=Purpose=
Demonstration of mashing up the basic network map REST resource with all the latest sensory awareness from an HTML5 device<br/><br/>

<br/>

=Overview=
This demonstration involves two parts:<br>
<div style="background:#FFF; color:#000; border-radius:10px; margin:10px; padding:5px;">
<b >USER INTERFACE</b>
<hr/>
<ul style="text-align:left;">
<li>Emphasis of this project was on demonstration of the capabilities in a modern UI framework</li>
<li>An attempt to push the limits of a web browser, JavaScript, and HTML5</li>
<li>Where JS/HTML5/Browsers fell short, a demonstration of a Native-built app was used</li>
<li>HTML5 elements used:</li>
* [http://caniuse.com/stream getUserMedia/Stream API]
* [http://caniuse.com/geolocation Geolocation API]
* [http://caniuse.com/deviceorientation DeviceOrientation API]
* [http://caniuse.com/transforms2d CSS Transforms API]
<li>JavaScript Frameworks used:</li>
* [http://js.arcgis.com ArcGIS JS API]
<li>Browsers used:</li>
* Chrome for Mac, Windows, iOS, Android
* Firefox for Mac, Windows, Android
* note that Firefox(beta) for Android was the only device usable with all HTML5 APIs
<li>Native App:</li>
*ObjectiveC / iOS
[link]
</ul>
</div>
<div style="background:#FFF; color:#000; border-radius:10px; margin:10px; padding:5px;">
<b>DATA SOURCES</b>
<hr/>
<ul style="text-align:left;">
<li>The main REST resource used is the demo is the publically available [http://services.arcgis.com/ArcGIS/rest/services/need_reference/MapServer ArcGIS Labels/Reference MapService]</li>
* This is the same resource you see consumed in the MintJ, SPOT, GTMi, and Network Designer apps
<li>Other data sources are the sensory awareness of the device used</li>
*GPS signals for position
*GPS/Accelerometers for bering
*Camera/Media feed for reality as the backdrop
</ul>
</div>

<br/>
=Documentation=
<br>
Git Repositories:<br>
<br>
JS: https://ipp-ci-00.i3.level3.com/hackathon2013/augrealityjs<br>
ObjC: https://ipp-ci-00.i3.level3.com/hackathon2013/augrealityobjc<br>

=Technical Details=

{| class="wikitable" border="1"
|+ HTML Body
! 
|-
|<pre>All of the HTML:
<body bgcolor="000">
	<div>
		<section id="app" hidden>
			<div class="container">
			<span id="live"><div id="map"></div> </span>
			<video id="monitor" autoplay></video>
			</div>
		</section>
	</div>
</body></pre>
|}

{| class="wikitable" border="1"
|+ Geolocation
! 
|-
|<pre>Example:
Handle Geolocation:

// check if geolocaiton is supported
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
		// retrieve update about the current geographic location of the device
		watchId = navigator.geolocation.watchPosition(showLocation, locationError);
	} else {
		alert("Browser doesn't support Geolocation. Visit http://caniuse.com to discover browser support for the Geolocation API.");
	}</pre>
|}

{| class="wikitable" border="1"
|+ Orient
! 
|-
|<pre>Example:
Compass:
function orientationChangeHandler() {
	// An event handler for device orientation events sent to the window.
	orientationHandle = on(window, "deviceorientation", onDeviceOrientationChange);
	// The setInterval() method calls rotateNeedle at specified intervals (in milliseconds).
	renderingInterval = setInterval(rotateNeedle, 100);
}</pre>

|}

{| class="wikitable" border="1"
|+ Rotate Map
! 
|-
|<pre>Example:
if (has('ff')) {
	var updatedAngle = needleAngle;
	dom.byId("map").style.MozTransform = "rotate(0deg)";
	dom.byId("map").style.MozTransform = "rotate(" + updatedAngle + "deg)";
}</pre>

|}

{| class="wikitable" border="1"
|+ userMedia
! 
|-
|<pre>getUserMedia for the proper browser:
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

Then execute getUserMedia:

navigator.getUserMedia({
	video : true,
	audio : false}, 
	function(localMediaStream) {
		var video = document.getElementById('monitor');
		video.addEventListener('click', changeFilter, false);
		video.src = window.URL.createObjectURL(localMediaStream);
	}, 
	onFail
); </pre>

|}
