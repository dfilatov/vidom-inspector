import { Component, mount, unmount } from 'vidom';

function FunctionComponent({ idx, cnt }) {
    return (
        <tr class={ idx % 2? 'odd' : 'even' }>
            <td>{ idx } item</td>
            <ClassComponent strProp="stringValue" boolProp={ true } numProp={ cnt }/>
        </tr>
    );
}

class ClassComponent extends Component {
    onRender() {
        return (
            <td>
                <span>{ this.attrs.numProp }</span>
            </td>
        );
    }
}

class App extends Component {
    onInit() {
        this._cnt = 0;
    }

    onRender() {
        return (
            <table class="app">
                {
                    Array.apply(null, Array(100)).map((_, i) => <FunctionComponent key={ i } idx={ i } cnt={ this._cnt }/>)
                }
            </table>
        );
    }

    onMount() {
        setInterval(() => {
            this._cnt++;
            this.update();
        }, 1000);
    }
}

mount(document.body, <App/>);

// setTimeout(function() {
//    unmount(document.body);
// }, 1000);