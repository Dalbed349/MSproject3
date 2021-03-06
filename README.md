# MSproject3

1. index.html directs to page for sketch 55 Mexican Masks mosaic. 
2. index1.html directs to page for sketch 57 Shunga mosaic. 

Code documentation work in progress. Some can be found in line. 

### A Manifestation of Masks - Exploring the Smithsonian Archive of Mexican Masks with an Interactive Mosaic. 

Title: A Manifestation of Masks - Exploring the Smithsonian Archive of Mexican Masks with an Interactive Mosaic. 

Description: 
This project proposes a unique user-driven way of browsing a museum collection in the digital space. Mexican Masks in the Smithsonian Institution Archives were chosen as the subject matter because humans have extremely high recognition of faces even when presented at lower resolution as seen in the mosaic. It’s worth noting that the allusion of having a mask masked by another mask was also considered as a design choice. A Mosaic was created using the base p5js library in order to realize these goals. Elements of interactivity were introduced so that users can select any of the ‘small images’ to force a redraw where that image was the ‘main mosaic image’. This allows individuals to jump through different images of museum items based on their desire to manifest realistic mask mosaics. Furthermore a bounded scroll window was created so that users can zoom in to the mosaic to view the ‘smaller images’ at full resolution.The result is a digital experience that allows users to browse the collection of masks through the lens of their curiosity.

#### Image Documentation 
1. Initial Landing 
![](https://github.com/Dalbed349/MSproject3/blob/main/ImageDocumentation/MSFinalScreenshot.jpg)
2. Zooming In 
![](https://github.com/Dalbed349/MSproject3/blob/main/ImageDocumentation/MSFinalScreenshot1.jpg)
3. Zooming In More
![](https://github.com/Dalbed349/MSproject3/blob/main/ImageDocumentation/MSFinalScreenshot2.jpg)
4. High Res Small Image 
![](https://github.com/Dalbed349/MSproject3/blob/main/ImageDocumentation/MSFinalScreenshot3.jpg)
5. Clicking on a Different Mask 
![](https://github.com/Dalbed349/MSproject3/blob/main/ImageDocumentation/MSFinalScreenshot4.jpg)
#### Code Documentation for main app (sketch55.js and index.html)

Inspiration TheCodingTrain processing mosaic: https://youtu.be/nnlAH1zDBDE

General process for creating a coded mosaic. 
1. preload. Load images into p5js with a function. We will need one image to serve as the 'mainImg'. This is established here.
```
function loadImages() {
  for (var i = 0; i < 75; i++) {
    images[i] = loadImage(folder + "/mask" + [i] + `.jpg`,
      function () {
        loadedImagesCount++;
        console.log(loadedImagesCount)
      }
```
2. Need to create a smaller image of the main image, and then make it the large size of image. "Shrink down, then resize small iamge back to large size" This creates a pixilation effect which we will use to calculate brightness values. The size of the tiles, or pixels, is static ('scaleBig') and set to 5.p5 copy method is used to resize image. 
```
//called in setup
function setSmallWH() {
  w = floor(mainImg.width / scaleBig);
  h = floor(mainImg.height / scaleBig);
  smallMain = createImage(w, h);
  smallMain.copy(mainImg, 0, 0, mainImg.width, mainImg.height, 0, 0, w, h);
}
```
3. A fuction is created to calculate the average brightness value for each image. This is called in setup. For each image .loadPixels and go through each column and row with a nested loop. getColorAtIndex funtion is called in here to acccess color values for each pixel in the p5 pixel array.
```
function calcValues() {
  for (var i = 0; i < images.length; i++) {            // start shrink + brightness value loop for all images

    // var anImage = images[i];                     
  
    images[i].loadPixels();
    //console.log(images[i].height)

    //brightness calculations double loop 
    let avgBright = 0;

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

```

4. Once we have the brightness values for each image, they are matched to a brightness value. I.e. image 5 has an average brightness of 200 so it will be the image for any pixel with brightness value 200. This code creates a new array of 256 brightness values with matching images. 
```
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
```

5. In the draw function, load the pixel array of the small main image which was created with copy method in step 2. Then for each pixel in the grid, find the color value and draw an image from the brightness array described above to match its value. 
```
  smallMain.loadPixels();

  // For every column and row standard double loop for x, nested for y 
  for (var x = 0; x < w; x++) {
    for (var y = 0; y < h; y++) {
      // ..draw an image that has the closest brightness value
      c = getColorAtIndex(smallMain, x, y);
    
      var imageIndex = floor(brightness(c));
    
      image(brightnessArray[imageIndex], x * scaleBig, y * scaleBig, scaleBig, scaleBig);

      ////////////IMPORTANT 
      // console.log(brightnessArray[imageIndex],imageIndex,x , y) // every pixel of main image 
      //console.log(y * scaleBig + 'y val')

    }
    //console.log(x* scaleBig + 'x val')
  }
  //  noLoop();

}// end draw 
```