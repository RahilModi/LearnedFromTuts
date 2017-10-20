
if(process.argv.length !== 3){
    console.log("You should need to pass the string to create and image using cellular autonoma")
    console.log("Eg. node index.js xyz");
}else{
    //will create an out.png in the directory.
    require('./createImage').createPNG(process.argv[2]);
}