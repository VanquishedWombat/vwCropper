/*
to use 
        const s1 = []
        funcs.dumpObjects(stage, 0, s1)
        console.table(s1)
*/
export const shapeRect = {x: 200, y: 100, width:200, height: 300}

export function getAspectFitSize(imgWidth, imgHeight, maxWidth, maxHeight) {
  const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
  return {
    width: imgWidth * ratio,
    height: imgHeight * ratio
  };
}

export function dumpObjects(node, depth, s){

    
    const spacer = '-'.repeat(depth)
    const obj = {
        node: spacer +  node.getClassName() +  " [" + node.name() + "]",
        listening: node.listening(),
        visible: node.visible(),
        parentListening: (node.getParent() ? node.getParent().listening() : 'null'),
        rect: JSON.stringify(node.getClientRect()),
        fill: (node.fill ? node.fill() : 'na'),
        opacity: (node.opacity ? node.opacity() : 'na'),
        position: (node.position ? JSON.stringify(node.position()) : 'na')
    }
    s.push(obj)

    node.on('click', () => {
        console.log('node clicked', node)
    })
    if (["Stage", "Layer", "Group"].includes(node.getClassName())){
        for (const child of node.getChildren()){
            dumpObjects(child, depth + 2, s)
        }
    }
 
}
 
// Initialize stage
const stageWidth = 1600;
const stageHeight = 700;
export const stage = new Konva.Stage({
      container: 'container',
      x: -20,
      y: 30,
      width: stageWidth,
      height: stageHeight 
    }),

    // Create layer
    layer = new Konva.Layer({
      x: 60,
      y: 120,
    }),
 
    // add an origin marker 
      originCircle = new Konva.Circle({
        x: 0, y: 0, radius: 7,
        strokeWidth: 1.5,
        stroke: 'silver',
        visible: true
      }),

      origin = new Konva.Star({
        x: 0, y: 0,
        numPoints: 4,
        innerRadius: 0,
        outerRadius: 18,
        strokeWidth: 1.5,
        stroke: 'silver',
      }),
 

    rect = new Konva.Rect({
      x: 300,
      y: 200,
      width: 200,
      height: 100,
      fill: 'blue',
      opacity: 1,
      draggable: true
    }),

    circle1 = new Konva.Circle({
      x: 120,
      y: 80,
      radius: 80,
      fill: 'red',
      opacity: 1,
      draggable: true
    }),

    circle2 = circle1.clone({
      name: 'circle2',
      x: 500,
      y: 380,
      fill: 'green'
    }),

    transformer = new Konva.Transformer({
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      keepRatio: true
    });
      
stage.add(layer);
layer.add(originCircle, origin, circle1, circle2, rect, transformer);
transformer.nodes([rect]  )

circle1.on('click', function(){
  transformer.nodes([circle1])
})

circle2.on('click', function(){
  transformer.nodes([circle2])
})

rect.on('click', function(){
  transformer.nodes([rect])
})

transformer.boundBoxFunc(function(oldBox, newBox){

  console.log('boundBoxFunc - oldBox', JSON.stringify(oldBox))
  console.log('boundBoxFunc - newBox', JSON.stringify(newBox))
    
})

rect.on('transformstart', function(){
  console.log('rect pos', JSON.stringify(rect.position()))
})
rect.on('transform', function(){
    console.log('rect transformed to', JSON.stringify(rect.position()))
})

export const shapes = {}
export const images = {}


shapes.circle = new Konva.Circle({
  x: shapeRect.x,
  y: shapeRect.y,
  radius: shapeRect.width / 2,
  stroke: 'black',
  strokeWidth: 4,
  draggable: true,
  rotation: 0,
  scale: {
    x: 0.5,
    y: 0.5
  },
  fillPatternRepeat: 'no-repeat',
})

shapes.rect = new Konva.Rect({
  x: shapeRect.x,
  y: shapeRect.y,
  cornerRadius: 10,
  width: shapeRect.width,
  height: shapeRect.height,
  stroke: 'black',
  strokeWidth: 4,
  draggable: true,
  rotation: 0,
  scale: {
    x: 0.5,
    y: 0.5
  }
})

shapes.ellipse = new Konva.Ellipse({
  x: shapeRect.x,
  y: shapeRect.y,
  radiusX: shapeRect.width / 2,
  radiusY: shapeRect.height / 2,
  stroke: 'black',
  strokeWidth: 4,
  draggable: true,
  rotation: 0,
  scale: {
    x: 0.5,
    y: 0.5
  },
  fillPatternRepeat: 'no-repeat',
})

shapes.hexagon = new Konva.RegularPolygon({
  x: shapeRect.x,
  y: shapeRect.y,
  radius: shapeRect.width / 2,
  sides: 6,
  stroke: 'black',
  strokeWidth: 4,
  draggable: true,
  rotation: 0,
  scale: {
    x: 0.5,
    y: 0.5
  },
  fillPatternRepeat: 'no-repeat',
})

shapes.ring = new Konva.Ring({
  x: shapeRect.x,
  y: shapeRect.y,
  innerRadius: shapeRect.width / 2,
  outerRadius: shapeRect.height,
  stroke: 'black',
  strokeWidth: 4,
  draggable: true,
  rotation: 0,
  scale: {
    x: 0.5,
    y: 0.5
  },
  fillPatternRepeat: 'no-repeat',
})

shapes.text = new Konva.Text({
  x: shapeRect.x,
  y: shapeRect.y,
  text: 'Text',
  fontSize: 30,
  fontFamily: 'Calibri',
  fill: 'green',
  draggable: true,
  rotation: 0,
  scale: {
    x: 0.5,
    y: 0.5
  },
  fillPatternRepeat: 'no-repeat',
});


shapes.image = new Konva.Image({
  x: shapeRect.x,
  y: shapeRect.y,
  width: shapeRect.width * 2,
  height: shapeRect.height * 2,
  fillPatternRepeat: 'no-repeat',
  fillPatternOffsetX: 20,
  fillPatternOffsetY: 20,
  fillPatternRepeat: 'no-repeat',
  fillPatternScaleX: 1, //0.07798232807502128,
  fillPatternScaleY: 1, //0.07798232807502127,
})


shapes.path1 = new Konva.Path({
  // data: 'M150,50 L184,131 L271,140 L202,196 L221,284 L150,240 L79,284 L98,196 L29,140 L116,131 Z',
  data: 'M 50 50 L 350 50 L 350 210 L 50 210 Z',
  // data: 'M 150 150 L 450 150 L 450 310 L 150 310 Z',
  // data: 'M 0 0 L 350 0 L 350 210 L 0 210 Z',
  // data: 'M 0 0 L 350 0 L 350 210 Z',
  x: shapeRect.x,
  y: shapeRect.y,
  width: shapeRect.width,
  height: shapeRect.height,
  stroke:'#0000FF77',
  strokeWidth: 4,
  draggable: true,
  rotation: 0,
  scale: {
    x: 3,
    y: 3
  },
  strokeScale: 0.5,
  strokeScaleEnabled: false,
  strokeWidth: 20,
});


shapes.path2 = new Konva.Path({
  data: 'M0,0L150,10V110H0V0Z',
  draggable: true,
  fillAfterStrokeEnabled: true,
  fillPatternOffsetX: -120,
  fillPatternOffsetY: -120,
  fillPatternRepeat: 'no-repeat',
  fillPatternScaleX: .1, //0.07798232807502128,
  fillPatternScaleY: .1, //0.07798232807502127,
  // height: 52.41999816894531,
  id: 'E9c3be0UMDzwLQI',
  // imgHeight: 838,
  // imgWidth: 679,
  listening: true,
  rotation: 0,
  scaleX: 3,
  scaleY: 3,
  stroke:  'transparent', //'blue',
  strokeScale: 0.5,
  strokeScaleEnabled: false,
  strokeWidth: 20,
  type: 'path',
  uiType: 'image',
  visible: true,
  // width: 52.95000076293945,
  x: shapeRect.x,
  y: shapeRect.y,
});

images.viking = 'https://res.cloudinary.com/mycreativeshop/image/upload/t_freedom_editor/v1/userimages/j17i5v5y7ea6egobs3ps?_a=BATCvBAA0'
images.cat = "assets/cat.jpg"
images.city = "assets/city.jpg"
images.dog = "assets/dog.jpg"
images.plane = "assets/plane.jpg"
images.toy = "assets/toy.jpg"
