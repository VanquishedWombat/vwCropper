
# vwCropper - a component for in-place image cropping

todo: demo movie

## Creating a vwCropper

A single vwCropper instance is all that is needed to power image cropping for all the images on your Konva canvas.

To make a cropper instantiate a new `vwCropper` - note the config object used at instantiation differs from the one in the `cropper.init()` - see below.


```js
// make a single vwCropper instance at page startup
const cropper = new vwCropper({license: "<license code or blank for demo>"})

// to start a cropping session on a Konva Path shape

cropper.init({
    path: myPath
})  
 
// or via the image double-click event
myPath.on('dblclick', function(){
    cropper.init({
        path: myPath
    })  
})

```

## Why Konva.Path and not Konva.Image?

The Konva.Path can contain images via thefillPatternImage attribute. This supports all the capabilities needed to make a cropper. A path can eb used to make rectangles which mimic images, but it can also make rounded-corner rectangles, stars, elipses, polygons, and any shape you care to dream up. As long as the path is closed, the vwCropper will let you crop an image into the closed path.

Konva.Images do not have rounded corners, and you can't make them into random shapes. So we use the Konva.Path.

todo: example paths.



# Direct methods

## init() 

As has been seen in the demo code above, `init()` is our way to tell vwCropper to focus on a specific Path. It requires a single argument which is a configuration object that must have at least the `image` value set to a Konva.Image.

All of the other keys of the configuration object are optional and are described below:

```js
export type initConfig = {
    path: Konva.Path;  // the target Konva.Path for the cropping activity
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

The `vwCropper.complete()` method applies the crop set by the user to the target shape and hides the vwCropper. 

```js
// make the vwCropper instance
const cropper = new vwCropper({license: "<license code or blank for demo>"})

// start a cropping session
cropper.init({
    path: myPath
})  
 
// Store the crop info  
document.getElementById("okButton").addEventListener("click", function (e) {

    cropper.complete() // apply the crop to myPath

})
```

## cancel() 

The `vwCropper.cancel()` method cancels the crop set by the user and hides the vwCropper. 

```js
// make the vwCropper instance
const cropper = new vwCropper({license: "<license code or blank for demo>"})

// start a cropping session
cropper.init({
    path: myPath
})  
 
// cancel the crop session.
document.getElementById("okButton").addEventListener("click", function (e) {

    cropper.cancel() // cancel the crop - restore myPath to state before cropping started.

})
```

## Serialization

The vwCropper sets the Konva.Path  `fillPatternOffet` and `fillPatternScale` attributes of the Konva.Path it operates on. Therefore, to re-apply the crop when the stage is re-loaded, save and re-apply the crop attribute value. 



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