import { Component } from 'vidom';
import { connect } from 'vidom-redux';
import * as treeActions from '../../actions/tree';
import bem from 'b_';
import Node from '../Node';

const b = bem.with('Tree');

class Tree extends Component {
    onRender() {
        const { tree, highlightNode, unhighlightNode, showNode } = this.attrs,
            { rootNodes, expandPath } = tree;

        return (
            <div class={ b() }>
                {
                    Object.keys(rootNodes).map(id =>
                        <Node
                            key={ id }
                            node={ rootNodes[id] }
                            level={ 0 }
                            expandPath={ expandPath }
                            actions={ { highlightNode, unhighlightNode, showNode } }
                        />)
                }
            </div>
        );
    }
}

export default connect(({ tree }) => ({ tree }), treeActions)(Tree);

