var socket = io.connect("http://localhost:3000");

var color = window.getComputedStyle(document.querySelector(".selected")).backgroundColor;
var ul = document.querySelector("ul");
var redRange = document.getElementById("red");
var greenRange = document.getElementById("green");
var blueRange = document.getElementById("blue");
var newColorPreview = document.getElementById("newColor");
var addNewColorButton = document.getElementById("addNewColor");
var saveImageButton = document.getElementById("saveImage");
var revealColorSelectButton = document.getElementById("revealColorSelect");

// var cursorSizeSelectButton = document.getElementById("changeCursorSize");
// var cursorRange = document.getElementById("cursorSize");
// var newSizePreview = document.getElementById("newCursorSize");
// var updateCursorButton = document.getElementById("updateSize");
// var pointerSize = cursorRange.value;

var cursorColor = color;

function setup() {
    createCanvas(600,400);
    background(255);

    fill(cursorColor);

    socket.on('mouse',(data)=>{
        console.log("Got: " + data.xPos + " " + data.yPos);
        // Draw a red circle
        console.log(data.curColor);
        fill(data.curColor);
        noStroke();
        ellipse(data.xPos, data.yPos, 20, 20);
    });
}

function draw() {
}

function mouseDragged(){
    var el = document.getElementById("colorSelect");
	var visability = window.getComputedStyle(el).display;
    noStroke();
    fill(cursorColor);
    ellipse(mouseX,mouseY,20,20);
    if(visability == 'none'){
        console.log('Sending : '+ mouseX + ' , ' + mouseY);
        var data = {
            xPos : mouseX,
            yPos : mouseY,
            curColor : cursorColor
        }
        console.log('mouse : '+data.xPos + ' , '+data.yPos);
        socket.emit('mouseMovement',data);
    }
}
function handleColorClick() {
	ul.querySelectorAll("li").forEach(function(el) {
		el.classList.remove("selected");
	});
	this.classList.add("selected");
	color = window.getComputedStyle(this).backgroundColor;
    cursorColor = color;
}

function bindColorClickHandler(el) {
	el.addEventListener("click", handleColorClick);
}

function changeColor(){
	var r = redRange.value;
	var g = greenRange.value;
	var b = blueRange.value;
	newColorPreview.style.background = "rgb(" + r + "," + g + "," + b + ")";
}

function updateCursorSize(){
    console.log(cursorRange.value);
    pointerSize = cursorRange.value;
    newSizePreview.innerHTML = pointerSize;
}

function bindChangeHandler(el) {
	el.addEventListener("input", changeColor);
}

function toggleFlexibility(elementId) {
	var el = document.getElementById(elementId);
	var visability = window.getComputedStyle(el).display;
	if(visability == "none") {
		el.style.display = "block";
	} else {
		el.style.display = "none";
	}
}
var canvas =  document.querySelector("canvas");

ul.querySelectorAll("li").forEach(bindColorClickHandler);

document.querySelectorAll("input[type=range]").forEach(bindChangeHandler);

revealColorSelectButton.addEventListener("click", function(){
    console.log('new color button clicked');
	changeColor();
	toggleFlexibility("colorSelect");
});

// cursorSizeSelectButton.addEventListener("click", function(){
//     console.log('cursor size update button clicked');
// 	updateCursorSize();
// 	toggleFlexibility("cursorSizeSelect")
// });


addNewColorButton.addEventListener("click", function(){
	var li = document.createElement("li");
	li.style.backgroundColor = window.getComputedStyle(newColorPreview).backgroundColor;
	ul.appendChild(li);
	bindColorClickHandler(li);
	li.click();
    toggleFlexibility("colorSelect");
});

saveImageButton.addEventListener("click", function(){
	var downloadLink = document.createElement("a");
	downloadLink.href = canvas.toDataURL();
	downloadLink.download = "image.png";
	downloadLink.target = "_blank";
	downloadLink.click();
});

// updateCursorButton.addEventListener("click", function(){
//     toggleFlexibility("cursorSizeSelect");
//     pointerSize = window.getComputedStyle(newSizePreview).innerHTML;
// });
//
// function updateSize(value){
//     console.log(value);
//     pointerSize = value;
//     newSizePreview.innerHTML = pointerSize;
// }
