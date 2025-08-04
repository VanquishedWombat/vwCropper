import * as vwCropper from '../dist/vwCropper-min.1.0.0.a7.js';
import { toolBarData as toolBarData1 } from './assets/buttonDataTop.js'
import * as vwToolBar from './libs/vwToolBar-min.js' 

import {stage, layer, transformer, getAspectFitSize, shapes, images, shapeRect } from "./bootFuncs.js"
 


let cropper, toolLayer;

let shapeName = 'rect'
let imageName = 'cat'

function  loadImage(shapeName, imageName, shapeRect, callback) {
   console.log('boot: loadImage starts', arguments)

  // make a kona image object and load an image into it.
  const img = new Image();
  img.onload = () => {


      // We want to mainain the aspect ratio of the image 
      const { width, height } = getAspectFitSize(img.naturalWidth, img.naturalHeight, shapeRect.width, shapeRect.height);
    
      if (callback) {
        callback(img)
      }

      let picNode = shapes[shapeName]      

      layer.add(picNode)
      picNode.fillPatternImage(img)
      picNode.draggable(true)
 

      layer.add(picNode)
      picNode.on('click', function(){
        transformer.nodes([picNode])
      })

      layer.add(picNode)

      picNode.on('click', function(e){
        transformer.nodes([picNode])
      })

      const actions = function(picNode){
        

      // check if the initialFit already ran
      let useInit = picNode.getAttr('cropperInitDone')
      useInit = (typeof useInit === 'undefined') ? true : false        

        cropper.init({
          shape: picNode, 
          initialFit: useInit,
          initialFitMarginPC: 0,
          outerAnchorPadding: 10,
          outerAnchorSize: 20,
          outerAnchorRadius: 10,
          overlayClickAction: 'cancel',
          callbacks: {
            opened: function(){
              console.log('cropper opened - callback fired')
            },
            completed: function(){
              console.log('cropper complete - callback fired')
            },
            canceled: function(){
              console.log('cropped cancelled - callback fired')
            },
            closed: function(){
              console.log('cropper closed - callback fired')
            }
          }
        })
        toolLayer.moveToTop()
      }
      picNode.on('dblclick', function(){

      actions(picNode)

      })
 
      const circle1 = stage.findOne('.circle1')
      if (circle1){
        circle1.moveToTop()
      }

      const circle2 = stage.findOne('.circle2')
      if (circle2){
        circle2.moveToTop()
      }

      actions(picNode)
      // end of onload event

};

console.log('load image named ', imageName)

const src = images[imageName];
console.log('loading image', src)
img.src = src; // invokes the onload event
return img
}

 
function setup(initialImageName){



    // Make a toolbar and add it to the stage. This is for dev only as the features that it provides will be done by external buttons of the Vue app. 
    const vwController = new vwToolBar.Controller({license: "00180672874881617C5C6F8E001A01424A4051392C48214523", id:'tb1'})



    // Mouse move tracking. 
    // todo: make this take account of scaling applied inside planner. 
    stage.on('mousemove', (e) => {

      // const mousePos = cropper.getMousePos()
      const mousePos = layer.getRelativePointerPosition()

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
 
          case "flipX":
            
            cropper.flipX()
            break;

          case "flipY":
            
            cropper.flipY()
            break;

          case "flipXY":
            
            cropper.flipXY()
            break;

          case "completeCrop":

            const myShape = cropper.config.shape
            myShape.setAttr('cropperInitDone', true)
            cropper.complete()


            break;

          case "cancelCrop":
            
            cropper.cancel()

            break;

          case "shape":


          shapeName = buttonEvent.value
          loadImage(shapeName, imageName, shapeRect)

            break

          case "image":

            imageName = buttonEvent.value
            loadImage(shapeName, imageName, shapeRect)

            break

          case "size":
            
            cropper.changeSize(buttonEvent.value)

            break;
        }
    }

    const barGroup = vwController.addToolBarGroup(toolBarData1, toolLayer, callback); 
   

    toolLayer.moveToTop() 

    // const  img = loadImage('smallcat.jpg', shapeRect)
    
    cropper = new vwCropper.Widget({license: "0018067287378461808A738E001A01424A4051392C48214522"});

    // show the first image
    if (initialImageName){
      const initialIShapeName = shapeName; 
        loadImage(initialIShapeName, initialImageName,  shapeRect)
    }

}

window.onload = () => {

  setup('cat')

}