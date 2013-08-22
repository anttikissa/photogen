var xhr = require('matthewp-xhr');
var keyname = require('component-keyname');
var classes = require('component-classes');
var fullscreen = require('component-fullscreen');

// my mini-jquery
function $(s) {
	return document.querySelector(s);
}

// array of photos & metadata
var photos;

// index of current photo
var current = -1;

window.onload = function() {
	xhr('photos.json',
		function (result) {
			try {
				photos = JSON.parse(result.responseText);
			}
			catch (err) {
				alert("Could not parse photos.json");
				console.log("Error parsing photos.json", err);
			}
			sanitizeMetadata();
			init();
		},
		function (err) {
			alert("Could not load photos.json");
			console.log("Error loading photos.json", err);
		}
	);
};

function sanitizeMetadata() {
	photos.forEach(function(photo) {
		photo.date = photo.date.replace(':', '-').replace(':', '-');
	});
}

// Attempt to make sense of location.hash.
// If it's a number in the range [1, photos.length], return it,
// otherwise return null.
function parseHash() {
	var idxStr = window.location.hash.replace('#', '')
	var idx = parseInt(idxStr);
	idx = Math.max(0, idx);
	idx = Math.min(idx, photos.length - 1);

	return isNaN(idx) ? null : idx;
}

function init() {
	if (!photos.length) {
		alert("No photos to show");
	}

	$('.prev').onclick = prev;
	$('.next').onclick = next;

	$('img').onclick = function() {
		fullscreen();
	};

	window.onpopstate = function(e) {
		var idx = parseHash();
		if (idx) {
			current = idx - 1;
			updateImage({ pushState: false });
		}
	}

	var idx = parseHash();
	if (idx) {
		current = idx - 1;
	} else {
		current = 0;
	}

	updateImage({ pushState: false });
}

function updateImage(opts) {
	opts = opts || {};
	if (typeof opts.pushState === 'undefined') {
		opts.pushState = true;
	}

	var photo = photos[current];
	pos = (current + 1) + ' / ' + photos.length;
	var name = photo.file + ' (' + pos + ')'
	$('img').src = photo.file;
	$('.title').innerHTML = name;
	$('.metadata').innerHTML = photo.date;
	var oneBasedIdx = current + 1;

	if (opts.pushState) {
		window.history.pushState(null, document.title, '#' + oneBasedIdx);
	}
	document.title = name;

	preloadNext();
}

function preloadNext() {
	var howMany = 2;
	var i;
	for (i = 0; i < howMany; i++) {
		(function(i) {
			setTimeout(function() {
				var next = Math.min(current + i + 1, photos.length - 1);
				var img = new Image();
				img.src = photos[next].file;
			}, i * 200);
		})(i);
	}
}

function next() {
//	console.log("next");
	current = Math.min(current + 1, photos.length - 1);
	updateImage();
}

function prev() {
//	console.log("prev");
	current = Math.max(current - 1, 0);
	updateImage();
}

document.onkeyup = function(e) {
	switch (keyname(e.keyCode)) {
		case 'left':
			$('.prev').click();
			asIfClicked($('.prev'));
			break;
		case 'right':
			$('.next').click();
			asIfClicked($('.next'));
			break;
	}
}

function asIfClicked(el) {
	classes(el).add('active');
	setTimeout(function() {
		classes(el).remove('active');
	}, 100);
//	console.log(el);
}
