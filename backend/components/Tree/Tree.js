import { Component } from 'vidom';
import connect from '../../util/connect';
import * as treeActions from '../../actions/tree';
import bem from 'b_';
import Node from '../Node';

const b = bem.with('Tree');

class Tree extends Component {
    onRender() {
        const { tree, actions } = this.attrs,
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
                            actions={ actions }
                        />)
                }
            </div>
        );
    }
}

export default connect(({ tree }) => ({ tree }), treeActions)(Tree);

