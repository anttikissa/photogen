xhr = require('matthewp-xhr');

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

	current = 0;

	$('img').src = photos[current].file;

	$('.prev').onclick = prev;
	$('.next').onclick = next;

//	photos.forEach(function(photo) {
//		console.log("Got photo ", photo);
//	});
}

function updateImage() {
	$('img').src = photos[current].file;
}

function next() {
	console.log("next");
	current++;
	updateImage();
}

function prev() {
	console.log("prev");
	current--;
	updateImage();
}

document.onkeyup = function(e) {
	console.log("keyup", e);
}

