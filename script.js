xhr = require('matthewp-xhr');
keyname = require('component-keyname');
classes = require('component-classes');

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
			init();
		},
		function (err) {
			console.log("Error loading photos.json", err);
			alert("Could not load photos.json");
		}
	);
};

function init() {
	if (!photos.length) {
		alert("No photos to show");
	}

	$('.prev').onclick = prev;
	$('.next').onclick = next;

	current = 0;
	updateImage();
}

function updateImage() {
	var photo = photos[current];
	$('img').src = photo.file;
	$('.title').innerHTML = photo.file;
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
