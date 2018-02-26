export default function getParentDomNode(domNode) {
    return (Array.isArray(domNode)? domNode[0] : domNode).parentNode;
}
