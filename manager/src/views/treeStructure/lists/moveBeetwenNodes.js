// else{
//     console.log("diff parents")

//     let newOrder;

//     if(position === "top")
//         newOrder = getNumberBeetwenTwoNumber(order - 1, order);

//     if(position === "bottom")
//         newOrder = getNumberBeetwenTwoNumber(order, order + 1);


//     state.data = state.data.map( item => {
//         if(item.id === drag.elem.id)
//             item.newOrder = newOrder;

//         console.log("itemPath", item.path)
//         console.log("dragPath", drag.elem.path)

//         if(isDescendant(item.path, drag.elem.path)){
//             const parentNewPath = `${ getParent(path) }.${ getPathId(drag.elem.path) }`
//             // console.log(parentNewPath)
//             item.newPath = item.path.replace(drag.elem.path, parentNewPath)
//         }

//         return item
//     })
//     // state.data.splice(elemIndex_2, 1, { ...data, dragIsRun: true })
// }


function isDescendant(path, path_2){
    return path.startsWith(path_2)
}