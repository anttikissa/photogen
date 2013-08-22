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
				console.log("Error parsing photos.json", err);
				alert("Could not parse photos.json");
			}
			sanitizeMetadata();
			init();
		},
		function (err) {
			console.log("Error loading photos.json", err);
			alert("Could not load photos.json");
		}
	);
};

function sanitizeMetadata() {
	photos.forEach(function(photo) {
		photo.date = photo.date.replace(':', '-').replace(':', '-');
	});
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

	/*
	window.onpopstate = function(e) {
		if (window.location.hash[0] == '#') {
			idxStr = window.location.hash.replace('#', '')
			var idx = parseInt(idxStr);
			if (!isNaN(idx)) {
				current = idx - 1;
				console.log("New index: " + current);
				updateImage();
			}
		}
	}
	*/

	current = 0;
	updateImage();
}

function updateImage() {
	var photo = photos[current];
	pos = (current + 1) + ' / ' + photos.length;
	$('img').src = photo.file;
	$('.title').innerHTML = photo.file + ' (' + pos + ')';
	$('.metadata').innerHTML = photo.date;

//	window.history.pushState(null, null, '#' + (current + 1));
	preloadNext();
}

function preloadNext() {
	var howMany = 2;
	var i;
	for (i = 0; i < howMany; i++) {
		(function(i) {
			console.log("preloading image " + i);
			setTimeout(function() {
				var next = Math.min(current + i + 1, photos.length - 1);
				var img = new Image();
				img.src = photos[next].file;
			}, i * 200);
		})(i);
	}
}

function next() {
	console.log("next");
	current = Math.min(current + 1, photos.length - 1);
	updateImage();
}

function prev() {
	console.log("prev");
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
	console.log("keyup", e.keyCode);
}

function asIfClicked(el) {
	classes(el).add('active');
	setTimeout(function() {
		classes(el).remove('active');
	}, 100);
	console.log(el);
}
