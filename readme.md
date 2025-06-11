


# Release Notes

# vwCropper 1.0.0.a5

- breaking change: renamed init.path, initialWrap, initialWrapMarginPC as follows

```js
export type initConfig = {
    shape?: Konva.Node;  // was path
    initialFit?: boolean;  // was initialWrap
    initialFitMarginPC?: number;  // was initialWrapMarginPC
    ...
```

- breaking change - renamed static method vwCropper.Widget.setInitialFillPatternImage to static method vwCropper.Cropper.fit.

- added static method vwCropper.Cropper.getFitInfo to return the tightest-fit info for the case where the image would be tightly wrapping the shape respecting aspect ratio. Returns an object containing the position, scale, and rotation of the image.

- added mouse wheel zoom support.  Added following 2 new related config keys:

```js
    zoomAmount?: number, // the amount to zoom per mouse-wheel step default 1.1
    zoomDirection?: number,  // the direction to zoom (1 for zoom in, -1 for zoom out)
```

Example
```js
export type initConfig = {
    shape: myNode;  // was path
    zoomAmount: 1.2, // the amount to zoom per mouse-wheel step default 1.1
    zoomDirection: 1,  // the direction to zoom (1 for zoom in, -1 for zoom out)
    ...
```



# vwCropper 1.0.0.a4 Changes

1. Breaking change: object name changed from 'Cropper' to 'Widget' in instantiation signature.

```js
const cropper = new vwCropper.Widget({license: "<license code or blank for demo>"})
```

2. Fixed isue with failing to hug bounds of main shape when scaled path stroke in use.

3. Added callbacks / events named  [ "opened","completed", "canceled","closed"]. Pass in a config.callbacks object with key names matching the event names or use the `on("<event name>", function)` method for event listening.

Callbacks example:

```js
cropper.init({
    shape: picNode, 
    keepRatio: false,     
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
```

## Important notes

Note #1: The cropper can only police that the shape is enclosed in the image if this is the state when the cropper is intiialised.

Note #2: To ensure image encloses the shape there is a config setting `config.initialWrap` (boolean), default `true`,  which will immediately reposition and scale the image to enclose the shape. The margin applied is store in `config.initialWrapMarginPC` which defaults to `10` (this is a percentage).  This may cause the image to move under the shape. Whilst this is not desireable UX, it will ONLY happen when the user opens the cropper for the shape, and this is point is probably a good time to fix the issue. meaning when the user is actively using the cropper to crop the image. 


----------


# vwCropper 1.0.0.a3 Changes

1. Breaking change: init parameter `path` is changed to `node`

```js
// to start a cropping session on a Konva Path shape
cropper.init({
    node: myNode
})  
...
```

2. vwCropper now supports most types of Konva.Shape that support the `fillpatternImage` attrs.



----

# vwCropper - a component for in-place image cropping

todo: demo movie

## Creating a vwCropper

A single vwCropper instance is all that is needed to power image cropping for any Konva.Shape that supports fillPatternImage.

To make a cropper instantiate a new `vwCropper` - note the config object used at instantiation differs from the one in the `cropper.init()` - see below. The target shape is locked and a cropper appears around it allowing the user to select all or part of an image by positioning and scaling the image until the desired area of the image is on view.


```js
// make a single vwCropper instance at page startup
const cropper = new vwCropper.Widget({license: "<license code or blank for demo>"})

// to start a cropping session on a Konva Path shape
cropper.init({
    node: myNode
})  
 
// or via the image double-click event
myPath.on('dblclick', function(){
    cropper.init({
        node: myNode
    })  
})

```

## Why Konva.Node and not Konva.Image?

Many Konva.Nodes can contain images via the fillPatternImage attribute. This supports all the capabilities needed to make a cropper. 

You can use Konva.Rect, Konva.Circle, Konva.RegularPolygon. Konva.Star, Konva.Path and many of the other types of Konva shapes.

Notably, the Konva.Path can be used to make rectangles which mimic images, but it can also make rounded-corner rectangles, stars, elipses, polygons, and any shape you care to dream up. As long as the path is closed, the vwCropper will let you crop an image into the closed path.


todo: examples.


# Direct methods

## init() 

As has been seen in the demo code above, `init()` is our way to tell vwCropper to focus on a specific Konva.Node. It requires a single argument which is a configuration object that must have at least the `node` value set to a type of Konva.Shape that supports fillPatternImage.

All of the other keys of the configuration object are optional and are described below:

```js
export type initConfig = {
    node: Konva.Node;  // the target Konva.Node for the cropping activity
    initialFit?: boolean;  // should we initiall wrap the image to enclose the shape if this is not the case?
    initialFitMarginPC?: number;  // the margin applied to the image when the initialFit is true
    keepRatio?: boolean;  // whether to keep the aspect ratio of the shape (image is always set to keep aspect ratio)
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
const cropper = new vwCropper.Widget({license: "<license code or blank for demo>"})

// start a cropping session
cropper.init({
    node: myNode
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
const cropper = new vwCropper.Widget({license: "<license code or blank for demo>"})

// start a cropping session
cropper.init({
    node: myNode
})  
 
// cancel the crop session.
document.getElementById("okButton").addEventListener("click", function (e) {

    cropper.cancel() // cancel the crop - restore myPath to state before cropping started.

})
```

## Static vwCropper.Widget.setInitialFillPatternImage()

This static method of the Widget class is exposed to help set up your Konva shape with its initial fillPatternImage position. It is supplied because circle-based shapes such as Konva.Circle, Konva.Ring, Konva.RegularPolygon, etc, have their default `fillPatternOffset` matching their origin which is at their center and which is not the usual desired position for the image to appear.  

The setInitialFillPatternImage() method requires as arguments the target node (mandatory) and an optional overflow percentage which defaults to 0.  Note that the code discovers the image being used from the `node.fillPatternImage` so be sure to have assigned this before calling this static method.

What it does is to position and scale the fillPatternImage so that it covers the node. If the overflow percentage is set then the image is made this amount larger which can look better when the cropper starts up. 

The aspect ratio of the image is used to ensure that the entire shape is covered by the image, and the center of the image is aligned with the center of the target node.

Use of this method is optional. You are welcome to pre-set the `fillPattern` attributes as you require, but getting the fillPatternImage into the correct scale and offset requires some complicated coordinate space switching and you may find this a handy feature.


```js
// make the vwCropper instance
const cropper = new vwCropper.Widget({license: "<license code or blank for demo>"})

// make a kona image object and load an image into it.
const img = new Image();
img.onload = () => {


    const pathShape = new Konva.Path({
        data: 'M150,50 L184,131 L271,140 L202,196 L221,284 L150,240 L79,284 L98,196 L29,140 L116,131 Z',
        x: 180,
        y: 120,
        width: 600,
        height: 400,
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,
        rotation: 45,
        scale: {
            x: 0.5,
            y: 0.5
        },
        fillPatternRepeat: 'no-repeat',
        fillPatternImage: img     
    });

    layer.add(pathShape)

    // without needing to have instantiated a cropper we 
    // can use this static method to intialise the image
    // into the shape.
    vwCropper.Widget.setInitialFillPatternImage(pathShape)
};
const path  = "/src/assets/" + myImageName 
img.src = path; // invokes the onload event above
```



## Serialization

The vwCropper sets the Konva.Nodes standard `fillPatternOffet` and `fillPatternScale` attributes of the Konva.Node it operates on. Therefore, to re-apply the crop when the stage is re-loaded, save and re-apply these attribute value. 

The image will appear as when the node data was saved, and the vwCropper will work as expected. 

** Note: The Konva built-in serialization does not handle images. You need to handle image loading in your own code. **



## Performance

The vwCropper temporarily adds various Konva nodes to the stage. These are removed when the `complete` and `cancel` are called, meaning that the overhead for vwCropper is very low and only a single instance that can be retained for the life of the page is needed.



## Roadmap

Future developments could include:  

- flip H & V
- apply mask
- blur 0 - 100% default 0
- brightness 0 - 100% default 50

- corner radius: 0 - half shortest side.
- shadow: offset x & y, color, opacity, blur

Please let us know the features that would help you in your dev projects by raising an issue.