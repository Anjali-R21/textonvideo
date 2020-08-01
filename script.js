document.addEventListener("DOMContentLoaded", function() { initialise(); }, false);

// Variables to store handles to various required elements
var mediaPlayer;
var changeColour = {
    'red': "blue",
    'blue': "green",
    'green': "yellow",
    'yellow': "white",
	'white': "red"
};

var drag;
var wordsList = [];


function initialise(){
	var client = new HttpClient();
	client.get('http://127.0.0.1:3000/topWords', function(response) {
		var jsonResponse = JSON.parse(response);
		console.log(jsonResponse);
		jsonResponse.forEach((element, index, array) =>{
			console.log(index.toString());
			document.getElementById("word" + index.toString()).innerHTML = element.name;
			document.getElementById("word" + index.toString() + "btn").innerHTML = element.name;
		});
		// console.log(wordsList);
	});
	initialiseMediaPlayer();
}
var HttpClient = function() {
	this.get = function(aUrl, aCallback) {
		var anHttpRequest = new XMLHttpRequest();
		anHttpRequest.onreadystatechange = function() {
			if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
				aCallback(anHttpRequest.responseText);
		}
		anHttpRequest.open( "GET", aUrl, true );
		anHttpRequest.send( null );
	}
}

function initialiseMediaPlayer() {
	drag = $('.text-draggable');
    drag.draggable({
          containment: "#media-video",
          cursor: "move",
          opacity: 0.35,
		  delay: 100
    });
	$( ".text-draggable" ).on( "dragstop", function( event, ui ) {
		let top = $(this).position().top;
		let left = $(this).position().left;
		// element.style.color = changeColour[element.style.color];
		let colour = $(this).css("color");

		if (document.getElementById($(this).attr("id") + "Dropdown")) {
			document.getElementById($(this).attr("id") + "Dropdown").innerHTML =
				('X: ' + left + ' ' + 'Y: ' + top );
			console.log('X: ' + left + ' ' + 'Y: ' + top );
		}
		if (document.getElementById($(this).attr("id") + "btn" + "Dropdown")) {
			document.getElementById($(this).attr("id") + "btn" + "Dropdown").innerHTML =
				('X: ' + left + ' ' + 'Y: ' + top + ' ' + 'colour: ' + colour);
			console.log('X: ' + left + ' ' + 'Y: ' + top + ' ' + 'colour: ' + colour);
		}
	} );

	let btnList = document.getElementsByClassName("toggleVal");
	for (let i = 0; i < btnList.length; i++) {
		btnList[i].addEventListener("click", displayList);
	}

	let txtList = document.getElementsByClassName(".text-draggable");
	for (let i = 0; i < txtList.length; i++) {
		txtList[i].addEventListener("click", changeColourOnClick);
	}
}

function displayList(event) {
	this.classList.toggle("active");
	let content = this.nextElementSibling;
	if (content.style.display === "block") {
		content.style.display = "none";
	} else {
		content.style.display = "block";
	}
}

function changeColourOnClick() {
	this.style.color = changeColour.get(this.style.color);
	this.classList.toggle("active");
	let content = this.nextElementSibling;
	if (content.style.display === "block") {
		content.style.display = "none";
	} else {
		content.style.display = "block";
	}
}