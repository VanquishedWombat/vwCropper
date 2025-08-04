const groupData = {
    id: "vwToolbar1",
    type: 'fixed',
    positionName: "topleft",
    toolBars: [
        {
            id: "bar1",
            show: false,
            minWidth: 800,
            minHeight: 10,
            buttons: [
                {id: 'shapeCircle', label: 'Circle', propName: 'shape', value: 'circle', tip: ''},
                {id: 'shapeEllipse', label: 'Ellipse', propName: 'shape', value: 'ellipse', tip: ''},
                {id: 'shapeRect', label: 'Rectangle', propName: 'shape', value: 'rect', tip: ''},
                {id: 'shapePath1', label: 'Path1', propName: 'shape', value: 'path1', tip: ''},
                {id: 'shapePath2', label: 'Path2', propName: 'shape', value: 'path2', tip: ''},
                {id: 'shapeImage', label: 'Image', propName: 'shape', value: 'image', tip: ''},
            ]
        },
        {
            id: "bar2",
            show: false,
            minWidth: 800,
            minHeight: 10,
            buttons: [
                {id: 'catImage', label: 'Cat', propName: 'image', value: 'cat', tip: ''},
                {id: 'dogImage', label: 'Dog', propName: 'image', value: 'dog', tip: ''},
                {id: 'planeImage', label: 'Plane', propName: 'image', value: 'plane', tip: ''},
                {id: 'toyImage', label: 'Toy', propName: 'image', value: 'toy', tip: ''},
                {id: 'cityImage', label: 'City', propName: 'image', value: 'city', tip: ''},
            ]
        },
        {
            id: "bar3",
            show: false,
            minWidth: 800,
            minHeight: 10,
            buttons: [
                {id: 'completeCrop', label: 'Complete', propName: 'completeCrop', propAttr: '', tip: 'Complete cropping'},
                {id: 'cancelCrop', label: 'Cancel', propName: 'cancelCrop', propAttr: '', tip: 'Cancel cropping'},   
                {id: 'Decrease', label: 'Decrease', propName: 'size', value: 'decrease', tip: 'Decrease image size'},
                {id: 'Increase', label: 'Increase', propName: 'size', value: 'increase', tip: 'Increase image size'},
                {id: 'txtPosInfo', label: 'Position: (0, 0)',  template: 'Position: (${value})', name: "mousePos", width: 140},   
            ]            
        }
    ]
}
 

export { groupData as "toolBarData" };