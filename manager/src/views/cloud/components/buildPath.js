import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);

export function buildPaths(rootPaths){
    let pathLtree = new Map();

    rootPaths.forEach( r_path => {
        // O ultimo "path" é o nome do arquivo;
        const path = r_path.split("/")
        path.pop()
        // para cada caminho cria um uuid
        path.forEach( (_, i) => {
            const cur = path.slice(0, i + 1).join("/");
            const has = pathLtree.get(cur);
            if(!has)
                pathLtree.set(cur, nanoid());
        })
    })
    let result = new Map()
    pathLtree.forEach( ( _, path ) => {
        const splited = path.split('/'),
            ltree = []

        splited.forEach( ( _, i )=> {
            const has = pathLtree.get(splited.slice(0, i + 1).join("/"));

            if(has)
                ltree.push(has)
        })
        result.set(path, ltree.join('.'))
    })
    return Array.from(result).map(([ path, pathltree ]) => {
        return { path, pathltree }
    })
}