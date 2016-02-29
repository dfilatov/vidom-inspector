const ID_PROP = '__vidom__inspector__id__';
let counter = 1;

function getDomNodeId(node, onlyGet) {
    return node[ID_PROP] || (onlyGet? null : node[ID_PROP] = counter++);
}

export default getDomNodeId;
