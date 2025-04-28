import * as vwCropper from '../dist/vwCropper-min-b1.js';

import { toolBarData as toolBarData1 } from './assets/buttonDataTop.js'
import * as vwToolBar from './libs/vwToolBar-min.js' 
import * as vwSelector from './libs/vwSelector-min.js';

import {stage, layer, transformer, imageShape, getAspectFitSize } from "./funcs.js"
 

let cropper, toolLayer;
 let imageName = ''

function loadImage(imageName, imageRect, callback) {
   console.log('boot: loadImage starts', arguments)

  // make a kona image object and load an image into it.
const img = new Image();
img.onload = () => {


  // We want to mainain the aspect ratio of the image 
  const { width, height } = getAspectFitSize(img.naturalWidth, img.naturalHeight, imageRect.width, imageRect.height);

  const imgShape = imageShape.clone({
    image: img,
    x: imageRect.x,
    y: imageRect.y,
    width: width,
    height: height
  })
  layer.add(imgShape)

  imgShape.image(img)
  
  transformer.nodes([imgShape])

  vwCropper.Logger.log("boot", "imageShape ", imgShape.image());
  
 
  if (callback) {
    callback(imgShape)
  }
  
  const circle2 = stage.findOne('.circle2')
  circle2.moveToTop()

  imgShape.on('click', function(){
    transformer.nodes([imgShape])
  })

  imgShape.on('dblclick', function(){
    cropper.init({image: imgShape,         
      outerAnchorPadding: 10,
      outerAnchorSize: 20,
      outerAnchorRadius: 10,
      overlayClickAction: 'complete' // or 'cancel ' to cancel clip
    })
    toolLayer.moveToTop()
  })


};
const path  = "./assets/" + imageName 
console.log('boot: loadImage from [' + path + ']')
img.src = path;



return img
}





window.onload = () => {

    // Make a toolbar and add it to the stage. This is for dev only as the features that it provides will be done by external buttons of the Vue app. 
    const vwController = new vwToolBar.Controller({license: "001A053E2C42293F224447414C", id:'tb1'})
    // vwToolBar.Utility.logKey.push("*") 

    // Set up the selector rect
    const selector = new vwSelector.Selector()
    vwSelector.Utility.logKey.push("*")

    selector.init({
      layer: layer,
      callbacks: {
          mousedown: function(e, rect) {
              console.log('mousedown', e, rect)
          },
          mousemove: function(e, rect) {
              console.log('mousemove', e, rect)
          },
          mouseup: function(e, rect) {
              console.log('mouseup', e, rect)
              rect.width = Math.max(10, rect.width)
              rect.height = Math.max(10, rect.height)
              loadImage(imageName, rect)

          }
      }
    })


    
    // Set up the toolbar
    toolLayer = new Konva.Layer({name: 'toolLayer', listening: true})
    stage.add(toolLayer)

    function callback (buttonEvent){
        console.log('callback: received', buttonEvent)
    
        switch (buttonEvent.name){

          case "newImage":
            selector.start()
            imageName = buttonEvent.value
            break;

          case "completeCrop":
            
            cropper.complete()
            break;

          case "cancelCrop":
            
            cropper.cancel()

            break;
        }
    }

    const barGroup = vwController.addToolBarGroup(toolBarData1, toolLayer, callback); 
   

    toolLayer.moveToTop() 

    const  img = loadImage('cat.jpg', {x: 200, y: 210, width:200, height: 300}, function(imgShape){
      imgShape.fire('dblclick')
    })
    

    // const config = {
    //   shape: imgShape,
    //   cropperScale: 1.5, // the exposed cropped image is 1.5 times the size of the original image
    //   cropperPosition: {x: 0, y: 0},  // outer image has this offset from the top-left of the visible image. 
    // }
  
    cropper = new vwCropper.Cropper();


}