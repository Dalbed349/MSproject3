
// Coding Challenge #49: Photo Mosaic with White House Social Media Images
// https://youtu.be/nnlAH1zDBDE



// size of each cell
var sclDiv = 500;
var w, h;
var imgAmount = 36;

let brightnessValues = [];
var allImages = [];
var brightImages = new Array(256);
var bigPicture;
var smaller;
var clicks = 0;

let folder = "data"   // folder containing images 
let loadedImagesCount = 0;
// to load all images from folder. currently using old shunga images until api for Mexican Masks sorted out.
function loadImages() {
  for (var i = 0; i < 36; i++) {
    allImages[i] = loadImage(folder + "/shunga" + [i] + `.jpg`,
      function () {
        // since these will load asynchronously, we have to keep track how many images have been loaded
        loadedImagesCount++;
        console.log(loadedImagesCount)
        //once all have been loaded, draw the images
        // if (loadedImagesCount == smithsonian_data.length) {                    //unnecessary draw but does not hurt 
        //   draw();
        // }
      }
    );
  }
}


function preload() {
loadImages();
bigPicture = allImages[26]; 
  
}

function mouseClicked(){
  //  clicks ++;


    bigPicture = allImages[35]
    setup();
    draw();


}



function setup() {
    
    // for (let i =1; i<256; i++){
    //     brightImages[i] = i;
    // }
    console.log(brightImages)

        
    console.log(bigPicture.width)
    console.log(bigPicture.height)
  createCanvas(bigPicture.width*2, bigPicture.height*2);


  scl = width / sclDiv;               /////// important 




  // Repeat the following for all images
  for (var i = 0; i < allImages.length; i++) {
//console.log(allImages.length)
    // Load the image
    var img = allImages[i];
//console.log(img)
    // Shrink it down
//    allImages[i] = createImage(scl, scl);
//     allImages[i].copy(img, 0, 0, img.width, img.height, 0, 0, scl, scl);
    allImages[i].loadPixels();

    // Calculate average brightness
    let avg = 0;
    // ORIGINALLY allImages[k].width / height
    for (var j = 0; j < allImages[i].height; j++) {
      for (var k = 0; k < allImages[i].width; k++) {
        let b = brightness(getColorAtIndex(allImages[i], k, j))
        avg += b;
      }
    }
//console.log(avg)
    avg /= allImages[i].width * allImages[i].height;
    brightnessValues[i] = avg;
    //console.log(brightnessValues)
  }
 
  // Find the closest image for each brightness value
  for ( i = 0; i < brightImages.length; i++) {
   
    let record = 256;
    for ( j = 0; j < brightnessValues.length; j++) {
      let diff = abs(i - brightnessValues[j]);
      if (diff < record) {
        record = diff;
        brightImages[i] = allImages[j];
        //console.log(brightImages[i])
      }
    }
  }
  

  // Calculate the amount of columns and rows
  w = bigPicture.width*2 / scl;
  h = floor(bigPicture.height*2 / scl);
  smaller = createImage(w, h);
  smaller.copy(bigPicture, 0, 0, bigPicture.width, bigPicture.height, 0, 0, w, h);
console.log(w)

}



function draw() {
  background(0);
  smaller.loadPixels();

  // For every column and row..
  for (var x = 0; x < w; x++) {
      //console.log(x)
    for (var y = 0; y < h; y++) {
      // ..draw an image that has the closest brightness value
    //   var index = x + y * w;
                              c = getColorAtIndex(smaller, x, y);
                              // console.log(c)
                           var imageIndex = floor(brightness(c));
                            // console.log(brightness(c))
     //c = smaller.pixels[index]
    // console.log(imageIndex)
    //console.log(c)
      //rect(x * scl, y* scl,scl, scl)
      //image(allImages[26],x * scl, y* scl,scl, scl)
      //console.log(imageIndex)
      image(brightImages[imageIndex], x * scl, y * scl, scl, scl);
      //image(smaller,0,0,bigPicture.width,bigPicture.height)
    }
  }
  noLoop();
}




function getColorAtIndex(img, x, y) {
  let idx = imageIndex(img, x, y);
  let pix = img.pixels;
  let red = pix[idx];
  let green = pix[idx + 1];
  let blue = pix[idx + 2];
  let alpha = pix[idx + 3];
  return color(red, green, blue, alpha);
}

function imageIndex(img, x, y) {
  return 4 * (x + y * img.width);
}