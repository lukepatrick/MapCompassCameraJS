require(["dojo/_base/Color", "dojo/dom", "dojo/dom-geometry", "dojo/has",
		 "dojo/on", "dojo/parser", "dojo/ready", "dojo/window", "esri/geometry/Point", 
		 "esri/graphic", "esri/map", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol", 
		 "esri/layers/ImageParameters", "esri/layers/ArcGISTiledMapServiceLayer"], 
		 
		 function(Color, dom, domGeom, has, on, parser, ready, 
		 	win, Point, Graphic, Map, SimpleLineSymbol, 
		 	SimpleMarkerSymbol, ImageParameters, ArcGISTiledMapServiceLayer) {

	var map;
	var pt;
	var graphic;
	var currLocation;
	var watchId;
	var Angle, 
	var renderingInterval = -1;
	var currentHeading;
	var hasCompass;


	ready(function() {
		parser.parse();

		var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

		window.addEventListener(orientationEvent, function() {
			orientationChanged();
		}, false);

		map = new Map("map", {
			//basemap: "gray",
			//center: [-117.708, 33.523],
			//zoom: 16,
			//sliderOrientation: "horizontal",
			slider : true
		});
		//var imageParameters = new ImageParameters();
		//imageParameters.format = "png32";

		//Takes a URL to a non cached map service.
		var MapServiceLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer", {
			//"opacity":0.5,
			//"imageParameters" : imageParameters
		});

		map.addLayer(MapServiceLayer);

		on(map, "load", mapLoadHandler);
		loadCompass();
	});

	// The HTML5 geolocation API is used to get the user's current position.
	function mapLoadHandler() {
		on(window, 'resize', map, map.resize);

		// check if geolocaiton is supported
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
			// retrieve update about the current geographic location of the device
			watchId = navigator.geolocation.watchPosition(showLocation, locationError);
		} else {
			alert("Browser doesn't support Geolocation. Visit http://caniuse.com to discover browser support for the Geolocation API.");
		}
	}

	function zoomToLocation(location) {
		pt = esri.geometry.geographicToWebMercator(new Point(location.coords.longitude, location.coords.latitude));
		addGraphic(pt);
		map.centerAndZoom(pt, 1);
	}

	function showLocation(location) {
		pt = esri.geometry.geographicToWebMercator(new Point(location.coords.longitude, location.coords.latitude));
		if (!graphic) {
			addGraphic(pt);
		} else {
			//move the graphic if it already exists
			graphic.setGeometry(pt);
		}
		map.centerAt(pt);
		//map.centerAndZoom(pt, 1);
	}

	function locationError(error) {
		//error occurred so stop watchPosition
		if (navigator.geolocation) {
			navigator.geolocation.clearWatch(watchId);
		}
		switch (error.code) {
			case error.PERMISSION_DENIED:
				alert("Location not provided");
				break;

			case error.POSITION_UNAVAILABLE:
				alert("Current location not available");
				break;

			case error.TIMEOUT:
				alert("Timeout");
				break;

			default:
				alert("unknown error");
				break;
		}
	}

	// Add a pulsating graphic to the map
	function addGraphic(pt) {
		var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([210, 105, 30, 0.5]), 8), new Color([210, 105, 30, 0.9]));
		graphic = new Graphic(pt, symbol);
		map.graphics.add(graphic);
	}

	function loadCompass() {

		currentHeading = 0;
		Angle = 0;

		hasWebkit();
	}

	var orientationHandle;
	function orientationChangeHandler() {
		// An event handler for device orientation events sent to the window.
		orientationHandle = on(window, "deviceorientation", onDeviceOrientationChange);
		// The setInterval() method calls rotate at specified intervals (in milliseconds).
		renderingInterval = setInterval(rotate, 100);
	}

	var compassTestHandle;
	function hasWebkit() {
		if (has("ie") || has("opera")) {
			hasCompass = false;
			orientationChangeHandler();
			alert("Your browser does not support the latest GeoLocation API.");
		} else if (window.DeviceOrientationEvent) {
			compassTestHandle = on(window, "deviceorientation", hasGyroscope);
		} else {
			hasCompass = false;
			orientationChangeHandler();
		}
	}

	// Test if the device has a gyroscope.
	// Instances of the DeviceOrientationEvent class are fired only when the device has a gyroscope and while the user is changing the orientation.
	function hasGyroscope(event) {
		dojo.disconnect(compassTestHandle);
		if (event.webkitCompassHeading != undefined || event.alpha != null || event.mozCompassHeading != undefined || event.compassHeading != undefined) {
			hasCompass = true;
		} else {
			hasCompass = false;
		}
		orientationChangeHandler();
	}

	// Rotate based on the device's current heading
	function rotate() {
		var multiplier = Math.floor(Angle / 360);
		var adjustedAngle = Angle - (360 * multiplier);
		var delta = currentHeading - adjustedAngle;
		if (Math.abs(delta) > 180) {
			if (delta < 0) {
				delta += 360;
			} else {
				delta -= 360;
			}
		}
		delta /= 5;
		Angle = Angle + delta;
		//var updatedAngle = Angle - window.orientation;
		// rotate 
		if (has('ff')) {
			var updatedAngle = Angle;

			dom.byId("map").style.MozTransform = "rotate(0deg)";
			dom.byId("map").style.MozTransform = "rotate(" + updatedAngle + "deg)";
		} else {
			var updatedAngle = Angle - window.orientation;
			dom.byId("map").style.MozTransform = "rotate(" + updatedAngle + "deg)";
		}
		orientationChanged();
	}

	function onDeviceOrientationChange(event) {
		var accuracy;

		if (event.webkitCompassHeading != undefined) {
			// Direction values are measured in degrees starting at due north and continuing clockwise around the compass.
			// Thus, north is 0 degrees, east is 90 degrees, south is 180 degrees, and so on. A negative value indicates an invalid direction.
			currentHeading = (360 - event.webkitCompassHeading);
			accuracy = event.webkitCompassAccuracy;
		} else if (event.alpha != null) {
			// alpha returns the rotation of the device around the Z axis; that is, the number of degrees by which the device is being twisted
			// around the center of the screen
			// (support for android)
			currentHeading = (360 - event.alpha);
			accuracy = event.webkitCompassAccuracy;
		}

		if (renderingInterval == -1)
			rotate();
	}

	// Convert degrees to radians
	function degToRad(deg) {
		return (deg * Math.PI) / 180;
	}

	// Handle portrait and landscape mode orientation changes
	function orientationChanged() {
		if (map) {
			map.reposition();
			map.resize();
		}
	}

});
