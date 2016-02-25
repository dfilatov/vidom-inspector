import { Component } from 'vidom';

export default class Provider extends Component {
    onInit({ store }) {
        this._childCtx = { store };
        this._unsubscribeFromStore = store.subscribe(() => {
            //console.log(store.getState());
            this.update();
        });
    }

    onChildContextRequest() {
        return this._childCtx;
    }

    onRender({ Component }) {
        return <Component/>;
    }

    onUnmount() {
        this._unsubscribeFromStore();
    }
}
