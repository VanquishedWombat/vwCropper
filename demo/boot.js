import * as vwCropper from '../dist/vwCropper-min-a2.js';
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
    
      if (callback) {
        callback(img)
      }
  
      const circle2 = stage.findOne('.circle2')
      circle2.moveToTop()
 

      const pathShape = new Konva.Path({
        // star
        data: 'M150,50 L184,131 L271,140 L202,196 L221,284 L150,240 L79,284 L98,196 L29,140 L116,131 Z',
        // various rects with offsets
        // data: 'M 50 50 L 350 50 L 350 210 L 50 210 Z',
        // data: 'M 150 150 L 450 150 L 450 310 L 150 310 Z',
        // data: 'M 0 0 L 350 0 L 350 210 L 0 210 Z',
        // triangle
        // data: 'M 0 0 L 350 0 L 350 210 Z',
        x: imageRect.x,
        y: imageRect.y,
        width: width,
        height: height,
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,
        rotation: 0,
        scale: {
          x: 0.5,
          y: 0.5
        }
      });

      pathShape.fillPatternImage(img)

      layer.add(pathShape)

 
      pathShape.on('click', function(){
        transformer.nodes([pathShape])
      })

      pathShape.on('dblclick', function(){
        cropper.init({
          path: pathShape,         
          outerAnchorPadding: 10,
          outerAnchorSize: 20,
          outerAnchorRadius: 10,
          overlayClickAction: 'cancel'
        })
        toolLayer.moveToTop()
      })
 

      // end of onload event

};
const path  = "./assets/" + imageName 
img.src = path; // invokes the onload event
return img
}





window.onload = () => {

    // Make a toolbar and add it to the stage. This is for dev only as the features that it provides will be done by external buttons of the Vue app. 
    const vwController = new vwToolBar.Controller({license: "0018029085707B6B7C367364001A044E3C2E452142283D4D3E", id:'tb1'})
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


        // Mouse move tracking. 
    // todo: make this take account of scaling applied inside planner. 
    stage.on('mousemove', (e) => {

      const mousePos = cropper.getMousePos()

      showPos(mousePos.x + ", " + mousePos.y)
    })

    // Function to update the scale info on the tool bar
    function showPos(pos){
        
         barGroup.setTemplateText('txtPosInfo', {value: pos})
 

  }


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

          case "size":
            
            cropper.changeSize(buttonEvent.value)

            break;
        }
    }

    const barGroup = vwController.addToolBarGroup(toolBarData1, toolLayer, callback); 
   

    toolLayer.moveToTop() 

    const  img = loadImage('smallcat.jpg', {x: 700, y: 200, width:200, height: 300})
    

    // const config = {
    //   shape: imgShape,
    //   cropperScale: 1.5, // the exposed cropped image is 1.5 times the size of the original image
    //   cropperPosition: {x: 0, y: 0},  // outer image has this offset from the top-left of the visible image. 
    // }
  
    cropper = new vwCropper.Cropper();


}