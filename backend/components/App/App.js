import Toolbar from '../Toolbar';
import Tree from '../Tree';
import bem from 'b_';

const b = bem.with('App');

export default function App() {
    return (
        <div class={ b() }>
            <Toolbar/>
            <Tree/>
        </div>
    );
}
