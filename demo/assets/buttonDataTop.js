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
                {id: 'addImage', label: 'New', type: "list",   options: ['Boat|boat.jpg', 'Cat|cat.jpg', 'City|city.jpg', 'Dog|dog.jpg', 'Plane|plane.jpg', 'Toy|toy.jpg'], propName: 'newImage', propAttr: '', tip: 'New image'},
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