export default (stateToAttrs, actions) => ConnectedComponent => function Connector(inputAttrs, children, { store }) {
    const stateAttrs = stateToAttrs(store.getState()),
        actionAttrs = {};

    if(actions) {
        Object.keys(actions).forEach(key => {
            actionAttrs[key] = (...args) => {
                store.dispatch(actions[key](...args));
            };
        });
    }

    const attrs = { ...stateAttrs, actions : actionAttrs, ...inputAttrs };

    return (
        <ConnectedComponent { ...attrs }>
            { children }
        </ConnectedComponent>
    );
};
