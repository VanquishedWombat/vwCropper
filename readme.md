
# vwCropper is an add-on component for cropping and scaling the images in-place.

todo: demo movie

## Creating a vwCropper

A single vwCropper instance is all that is needed to power image cropping for all the images on your Konva canvas.


```js
// make a single vwCropper instance at page startup
const cropper = new vwCropper({license: "<license code or blank for demo>"})

// to start a cropping session on a Konva image

cropper.init({
    image: myImage
})  
 
// or via the image double-click event
myImage.on('dblclick', function(){
    cropper.init({
        image: myImage
    })  
})

```

# Direct methods

## init() 

As has been seen in the demo code above, `init()` is our way to tell vwCropper to focus on a specific image. It requires a single argument which is a configuration object that must have at least the `image` value set to a Konva.Image.

All of the other keys of the configuration object are optional and are described below:

```js
export type initConfig = {
    image?: Konva.Image;  // the target image for the cropping activity
    keepRatio?: boolean;  // whether to keep the aspect ratio of the image
    useOverlay?: boolean;  // whether to use an overlay
    overlayClickAction?: 'Cancel' | 'Complete';  // what action to take when the overlay is clicked
    overlayFill?: string;  // the fill color of the overlay
    overlayOpacity? : number;  // the opacity of the overlay
    outerAnchorPadding?: number;  // padding around the outer transformer
    outerAnchorSize?: number;  // size of the outer anchors
    outerAnchorRadius?: number;  // radius of the outer anchors
    outerAnchorStroke?: string;  // stroke color of the outer anchors
    outerAnchorFill?: string;  // fill color of the outer anchors
    innerAnchorPadding?: number;  // padding around the inner transformer
    innerAnchorSize?: number;  // size of the inner anchors
    innerAnchorRadius?: number;  // radius of the inner anchors
    innerAnchorStroke?: string;  // stroke color of the inner anchors
    innerAnchorFill?: string;  // fill color of the inner anchors
}
```

## complete() 

The `vwCropper.complete()` method applies the crop set by the user to the target image and hides the vwCropper. 

```js
// make the vwCropper instance
const cropper = new vwCropper({license: "<license code or blank for demo>"})

// start a cropping session
cropper.init({
    image: myImage
})  
 
// Store the crop info  
document.getElementById("okButton").addEventListener("click", function (e) {

    cropper.complete() // apply the crop to myImage

})
```

## cancel() 

The `vwCropper.cancel()` method cancels the crop set by the user and hides the vwCropper. 

```js
// make the vwCropper instance
const cropper = new vwCropper({license: "<license code or blank for demo>"})

// start a cropping session
cropper.init({
    image: myImage
})  
 
// cancel the crop session.
document.getElementById("okButton").addEventListener("click", function (e) {

    cropper.cancel() // cancel the crop - restore myImage to state before cropping started.

})
```

## Performance

The vwCropper temporarily adds various Konva nodes to the stage. These are removed when the `complete` and `cancel` are called, meaning that the overhead for vwCropper is very low and only a single instance that can be retained for the life of the page is needed.



## Roadmap

Future developments could include:  

- flip H & V
- apply mask
- blur 0 - 100% default 0
- brightness 0 - 100% default 50
- border, color + width
- corner radius: 0 - half shortest side.
- shadow: offset x & y, color, opacity, blur

Please let us know the features that would help you in your dev projects by raising an issue.