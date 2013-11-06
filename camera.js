function hasGetUserMedia() {
	// Note: Opera is unprefixed.
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
	// Good to go!
} else {
	alert('getUserMedia() is not supported in your browser');
}

var onFailSoHard = function(e) {
	console.log('Reeeejected!', e);
};

var idx = 0;
var app = document.getElementById('app');
var filters = ['grayscale', 'sepia', 'blur', 'brightness', 'contrast', 'hue-rotate', 'hue-rotate2', 'hue-rotate3', 'saturate', 'invert', ''];

function changeFilter(e) {
	var el = e.target;
	el.className = '';
	var effect = filters[idx++ % filters.length];
	// loop through filters.
	if (effect) {
		el.classList.add(effect);
	}
}

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

// Not showing vendor prefixes.
navigator.getUserMedia({
	video : true,
	audio : false,
	mandatory: [
    { facingMode: "back" }
  ]
	
}, function(localMediaStream) {
	var video = document.getElementById('monitor');
	video.addEventListener('click', changeFilter, false);
	video.src = window.URL.createObjectURL(localMediaStream);
	console.log(localMediaStream);
	console.log(localMediaStream.getVideoTracks());

	// Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
	// See crbug.com/110938.
	video.onloadedmetadata = function(e) {
		// Ready to go. Do some stuff.
		document.getElementById('app').hidden = false;
	};
	// Since video.onloadedmetadata isn't firing for getUserMedia video, we have
	// to fake it.
	setTimeout(function() {
		document.getElementById('app').hidden = false;
	}, 50);
}, onFailSoHard); 
