import { Component } from  'vidom';
import bem from 'b_';
import Value from '../Value';

const b = bem.with('Node'),
    tagClass = b('tag'),
    collapserClass = b('collapser'),
    childrenClass = b('children'),
    tagNameClass = b('tagName'),
    attrClass = b('attr'),
    attrNameClass = b('attrName'),
    attrValueClass = b('attrValue');

export default class Node extends Component {
    onInit() {
        this._openTagRef = null;
        this._closeTagRef = null;

        this._onMouseOver = this._onMouseOver.bind(this);
        this._onMouseOut = this._onMouseOut.bind(this);
        this._onCollapserClick = this._onCollapserClick.bind(this);
        this._onTagNameClick = this._onTagNameClick.bind(this);
        this._onOpenTagRef = ref => {
            this._openTagRef = ref;
        };
        this._onCloseTagRef = ref => {
            this._closeTagRef = ref;
        };

        const { node, expandPath, level } = this.attrs,
            inExpandPath = !!(expandPath && expandPath[level] === node.id);

        this.setState({
            hovered : false,
            collapsed : node.type > 3 && !inExpandPath,
            selected : inExpandPath && expandPath.length === level + 1
        });
    }

    onChange({ expandPath : prevExpandPath, node }) {
        const { expandPath, level } = this.attrs;

        if(expandPath !== prevExpandPath) {
            if(expandPath && expandPath[level] === node.id) {
                this.setState({
                    collapsed : false,
                    selected : expandPath.length === level + 1
                });
            }
            else if(prevExpandPath) {
                this.setState({ selected : false });
            }
        }
    }

    shouldRerender({ node : prevNode }, _, prevState) {
        return this.attrs.node !== prevNode || this.state !== prevState;
    }

    onRender() {
        const { node, actions, level, expandPath } = this.attrs,
            { type, name, attrs, children } = node,
            { hovered, collapsed, selected } = this.state,
            hasChildren = !!children,
            onlyStringChild = hasChildren && typeof children === 'string',
            tagStyle = { paddingLeft : (level + 1.2) + 'em' };

        return (
            <div
                class={ b({ type, onlyStringChild, hovered, collapsed, selected }) }
                onMouseOver={ this._onMouseOver }
                onMouseOut={ this._onMouseOut }
                >
                <div key="open" class={ tagClass } style={ tagStyle } ref={ this._onOpenTagRef }>
                    { !hasChildren || onlyStringChild || type === 3?
                        null :
                        <span class={ collapserClass } onClick={ this._onCollapserClick }>
                            { collapsed? '▶' : '▼' }
                        </span>
                    }
                    <span class={ tagNameClass } onClick={ this._onTagNameClick }>{ '<' + name }</span>
                    { attrs && renderAttrs(node, attrs) }
                    <span>
                        { (hasChildren && !collapsed? '' : '/') + '>' }
                    </span>
                </div>
                { hasChildren && !collapsed?
                    [
                        <div key="children" class={ childrenClass }>
                            { onlyStringChild?
                                children :
                                children.map(child =>
                                    <Node
                                        node={ child }
                                        actions={ actions }
                                        level={ level + 1 }
                                        expandPath={ expandPath }
                                    />)
                            }
                        </div>,
                        <div
                            key="close"
                            class={ tagClass }
                            style={ onlyStringChild? null : tagStyle }
                            ref={ this._onCloseTagRef }
                            >
                            { '</'}
                            <span class={ tagNameClass } onClick={ this._onTagNameClick }>{ name }</span>
                            { '>' }
                        </div>
                    ] :
                    null
                }
            </div>
        );
    }

    onMount() {
        if(this.state.selected) {
            scrollIntoViewIfNeeded(this._openTagRef);
        }
    }

    onUpdate(prevAttrs, prevChildren, prevState) {
        const { selected, hovered } = this.state;

        if(selected && !prevState.selected) {
            scrollIntoViewIfNeeded(this._openTagRef);
        }

        if(hovered) {
            const { node, actions } = this.attrs;

            actions.highlightNode(node);
        }
    }

    onUnmount() {
        if(this.state.hovered) {
            const { node, actions } = this.attrs;

            actions.unhighlightNode(node);
        }
    }

    _onMouseOver(e) {
        e.stopPropagation();

        const { node, actions } = this.attrs;

        if(!this.state.hovered) {
           this.setState({ hovered : true });

           actions.highlightNode(node);
        }
    }

    _onMouseOut(e) {
        e.stopPropagation();

        const { relatedTarget } = e.nativeEvent;

        if([this._openTagRef, this._closeTagRef].every(ref => !ref || !ref.contains(relatedTarget))) {
            this.setState({ hovered : false });

            const { node, actions } = this.attrs;

            actions.unhighlightNode(node);
        }
    }

    _onCollapserClick(e) {
        e.stopPropagation();

        this.setState({ collapsed : !this.state.collapsed });
    }

    _onTagNameClick(e) {
        e.stopPropagation();

        const { node, actions } = this.attrs;

        actions.showNode(node);
    }
}

function renderAttrs(node, { value }) {
    return value && Object.keys(value).map(name => {
        if(node.type === 1 && value[name].type === 'boolean') {
            return value[name].value?
                <span key={ name } class={ b('attr') }>
                    <span key="name" class={ b('attrName') }>{ name }</span>
                </span> :
                null;
        }

        return (
            <span key={ name } class={ attrClass }>
                <span class={ attrNameClass }>{ name }</span>
                <span>=</span>
                <span class={ attrValueClass }>
                    <Value value={ value[name] }/>
                </span>
            </span>
        );
    });
}

function scrollIntoViewIfNeeded(domNode) {
    const { top, height } = domNode.getBoundingClientRect(),
        { innerHeight : viewportHeight } = window;

    if(top < 0 || top + height > viewportHeight) {
        domNode.scrollIntoView();
    }
}
