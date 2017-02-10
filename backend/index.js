import { createStore, applyMiddleware } from 'redux';
import { mount } from 'vidom';
import rootReducer from './reducers';
import treeMiddleware from './middlewares/tree';
import Provider from './components/Provider';
import App from './components/App';

const createStoreWithMiddleware = applyMiddleware(treeMiddleware)(createStore),
    store = createStoreWithMiddleware(rootReducer);

export default function(rootDomNode, done) {
    mount(
        rootDomNode,
        <Provider store={ store }>
            <App/>
        </Provider>,
        done);
}
