var mainImg;                // main display img for mosaic/ will be formed from images[]
var smallMain;              // scale down res big img
var images = [];
var imagesS = [];          // array to hold img load 
var brightnessArray = new Array(256);    // total brightness values 0-256
let brightVals = [];       // brightness for all imgs

var scaleBig = 5;
var w;
var h;



/////////// SHUNGAS

// let folder = "data"   // folder containing images 
// let loadedImagesCount = 0;
// // to load all images from folder. currently using old shunga images until api for Mexican Masks sorted out.
// function loadImages() {
//   for (var i = 0; i < 36; i++) {
//     images[i] = loadImage(folder + "/Shunga" + [i] + `.jpg`,
//       function () {
//         loadedImagesCount++;
//         console.log(loadedImagesCount)

//       }
//     );
//   }
// }

///////////MASKS

let folder = "data1"   // folder containing images 
let loadedImagesCount = 0;
// to load all images from folder. currently using old shunga images until api for Mexican Masks sorted out.
function loadImages() {
  for (var i = 0; i < 75; i++) {
    images[i] = loadImage(folder + "/mask" + [i] + `.jpg`,
      function () {
        loadedImagesCount++;
        console.log(loadedImagesCount)

      }
    );
  }
}


function preload() {
  loadImages();
  mainImg = images[0];

}



let clicks = 0;
function mouseClicked() {
  clicks++;
  console.log(clicks);
  stroke(0);
  if (mouseX < mainImg.width && mouseY < mainImg.height && mouseX > 0 && mouseY > 0) {
    let x = Math.floor(mouseX / scaleBig);
    let y = Math.floor(mouseY / scaleBig);
    fill(220);
    rect(x * scaleBig, y * scaleBig, scaleBig, scaleBig);
    console.log(x * scaleBig, y * scaleBig)


    c = getColorAtIndex(smallMain, x, y);
    //console.log(c)
    var imageIndex = floor(brightness(c));

    mainImg = brightnessArray[imageIndex]
    console.log(mainImg)
    setup();
    redraw();
  }
}// end mouse clicked


function setWidth() {
  //scaleBig = width / scaleBigg; 
  console.log(width, scaleBig)
}



function setSmallWH() {
  w = floor(mainImg.width / scaleBig);
  h = floor(mainImg.height / scaleBig);
  smallMain = createImage(w, h);
  smallMain.copy(mainImg, 0, 0, mainImg.width, mainImg.height, 0, 0, w, h);
}



function calcValues() {
  for (var i = 0; i < images.length; i++) {            // start shrink + brightness value loop for all images

    // var anImage = images[i];                          // +1 or errror.... WHY DOES THIS ARRAY ALWAYS CONTAIN AN 'EMPTY' FIRST ELEMENT w/ width 10 height 10????? 
  
    images[i].loadPixels();
    //console.log(images[i].height)

    //brightness calculations double loop 
    let avgBright = 0;

    // for (var j = 0; j<images[i].height; j++){
    //   console.log( images[j].height)
    // }

    // for (var k = 0; k<images[i].width; k++){
    //     console.log( images[k].width)
    //     bright= brightness(getColorAtIndex(images[i],k,j))
    //     avgBright += bright; 
    //   }
    for (var j = 0; j < images[i].height; j++) {

      for (var k = 0; k < images[i].width; k++) {
        let b = brightness(getColorAtIndex(images[i], k, j))
        avgBright += b;
      }
    }
    avgBright /= images[i].width * images[i].height;
    brightVals[i] = avgBright;

  }
}


let canvas1;
function setup() {
  console.log(mainImg.width)
  // set main img 
  setWidth();
  setSmallWH();
  canvas = createCanvas(mainImg.width, mainImg.height);    // set canvas to main img dimensions 
  canvas.parent('MosaicVis');
  canvas1 = document.getElementById('defaultCanvas0');

  if (clicks < 1) {
    calcValues();
    console.log(canvas1)
  }

  //The deltaY property returns a positive value when scrolling down, and a negative value when scrolling up, otherwise 0.

  canvas1.addEventListener("wheel", function (e) {
    if (e.deltaY > 0)
      sf *= 1.05;
    else
      sf *= 0.95;
  });

  //end pixel loop 
  //console.log(brightVals)
  for (i = 0; i < brightnessArray.length; i++) {                    // match small imgs to bright values 
    let record = 256;
    for (j = 0; j < brightVals.length; j++) {
      let diff = abs(i - brightVals[j]);
      if (diff < record) {
        record = diff;
        brightnessArray[i] = images[j];
        //console.log(brightnessArray[i],i,images[j],j)  //////////////////IMPORTANT *****
      }
    }

  }
  ////////main image size column rows 
  //if( clicks == 0){
  // w = floor(mainImg.width / scaleBig);
  // h = floor(mainImg.height / scaleBig);
  // smallMain = createImage(w, h);
  // smallMain.copy(mainImg, 0, 0, mainImg.width, mainImg.height, 0, 0, w, h);
  //}
  console.log(scaleBig) // THIS IS GETTING CHANGED ON RERUN .... ***********************************
  console.log(mainImg.width, mainImg.height)
  console.log(w, h)
  console.log(smallMain)




}// end setup

function draw() {
  mx = mouseX;
  my = mouseY;

  if (sf > 1 && mx > 0 && mx < mainImg.width && my > 0 && my < mainImg.height) {
    translate(mx, my);
    scale(sf); // modulated by deltaY 
    translate(-mx, -my);
  }

  if (sf < 1) {
    sf = 1
  }

  //////////////////////////////////////
  background(0);
  smallMain.loadPixels();

  // For every column and row standard double loop for x, nested for y 
  for (var x = 0; x < w; x++) {
    for (var y = 0; y < h; y++) {
      // ..draw an image that has the closest brightness value
      c = getColorAtIndex(smallMain, x, y);
      //console.log(c)
      var imageIndex = floor(brightness(c));
      //console.log(imageIndex)
      image(brightnessArray[imageIndex], x * scaleBig, y * scaleBig, scaleBig, scaleBig);

      ////////////IMPORTANT 
      // console.log(brightnessArray[imageIndex],imageIndex,x , y) // every pixel of main image 
      //console.log(y * scaleBig + 'y val')

    }
    //console.log(x* scaleBig + 'x val')
  }
  //  noLoop();

}// end draw 

function getColorAtIndex(anImage, x, y) {               /// 8 minutes : https://www.youtube.com/watch?v=0L2n8Tg2FwI&feature=emb_logo&ab_channel=TheCodingTrain
  let idx = imageIndex(anImage, x, y);      // small block OF BIG BLOCK index 
  let pix = anImage.pixels;                // we have loaded individual pixels now assign to variable 
  let red = pix[idx];                      // r = 0
  let green = pix[idx + 1];               // g = 1
  let blue = pix[idx + 2];                // b = 2
  let alpha = pix[idx + 3];                 // a = 3 
  return color(red, green, blue, alpha);    // color = rgba
}


function imageIndex(anImage, x, y) {
  return 4 * (x + y * anImage.width);      /// 4*(x + y * w ) formula  returns r,g,b,a for each small block 
}
//var index = x + y * w;

let sf = 1; // scaleFactor
let xx = 0; // pan X
let yy = 0; // pan Y

let mx, my; // mouse coords;

