//getting hour,minute and second hand from the DOM object
const HOURHAND = document.querySelector("#hour");
const MINUTEHAND = document.querySelector("#minute");
const SECONDHAND = document.querySelector("#second");
//Current Date object
var date = new Date();
//getting current hour,minute and seconds
let hr =  date.getHours();
let min = date.getMinutes();
let sec = date.getSeconds();
//calculating hour,minute and second arms positions
let hrPos = (hr*360/12) + (min * (360/60)/12);
let minPos = (min*360/60) + (sec*(360/60)/60);
let secPos = sec*360/60;

//function will be called for every second
function runTheClock(){
    //incrementing the position of the hour, minute and second arms at every second
    hrPos = hrPos + (360/(12*3600));
    minPos = minPos + (360/(60*60));
    secPos = secPos + 360/60;
    //rotate the arms
    HOURHAND.style.transform = "rotate("+hrPos+"deg)";
    MINUTEHAND.style.transform = "rotate("+minPos+"deg)";
    SECONDHAND.style.transform = "rotate("+secPos+"deg)";
}
//call runTheClock function every 1000ms /1 second
var interval = setInterval(runTheClock,1000);
