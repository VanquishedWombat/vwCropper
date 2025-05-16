
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
      x: 40,
      y: 40,
    }),

    imageGroup = new Konva.Group({
      x: 130,
      y: 90,
      rotation: 10
    }),

    imageShape = new Konva.Image({

      width: 400,
      height: 300,
      draggable: true,
      image: undefined,
    //   rotation: 10
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
      opacity: 1
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
layer.add(circle1, imageGroup, circle2, rect, transformer);
imageGroup.add(imageShape);
