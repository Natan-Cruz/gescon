import _ from 'underscore';

export function treeify (paths) {
    var tree = [];

    // This example uses the underscore.js library.
    _.each(paths, function(path) {
        var pathParts = path.path.split('.');
        // pathParts.shift(); // Remove first blank element from the parts array.
        var currentLevel = tree; // initialize currentLevel to root

        _.each(pathParts, function(part, i) {
            // check to see if the path already exists.
            var existingPath = _.findWhere(currentLevel, {
                name: part
            });
            if (existingPath) {
                // The path to this item was already in the tree, so don't add it again.
                // Set the current level to this path's children
                currentLevel = existingPath.children;
            } else {
                var newPart = {
                    path: pathParts.slice(0,i + 1).join("."), 
                    data: path,
                    deep: pathParts.length, 
                    name: part,
                    children: [],
                }

                currentLevel.push(newPart);
                currentLevel.sort(orderBy) // orderna itens 
                currentLevel = newPart.children;
            }
        });
    });

    return tree
}

function orderBy(a, b) {
    if (a.data.order < b.data.order) {
      return -1;
    }
    if (a.data.order > b.data.order) {
      return 1;
    }
    // a deve ser igual a b
    return 0;
  }