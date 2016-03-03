import highlighter from './highlighter';

let backdrop = null,
    onHover = null,
    onSelect = null,
    currentDomNode = null;

function blockEvent(e) {
    e.stopPropagation();
}

function onMouseMove(e) {
    blockEvent(e);

    backdrop.style.display = 'none';
    highlighter.unhighlight();

    const newCurrentDomNode = document.elementFromPoint(e.x, e.y);

    if(newCurrentDomNode !== currentDomNode) {
        currentDomNode = newCurrentDomNode;
    }

    if(onHover(currentDomNode)) {
        highlighter.highlight(currentDomNode);
    }

    backdrop.style.display = 'block';
}

function onMouseOut(e) {
    blockEvent(e);

    highlighter.unhighlight();
}

function onClick(e) {
    blockEvent(e);

    currentDomNode && onSelect(currentDomNode);
}

export default {
    init() {
        backdrop = document.createElement('div');
        backdrop.style.display = 'none';
        backdrop.style.position = 'fixed';
        backdrop.style.zIndex = '10000';
        backdrop.style.left = 0;
        backdrop.style.top = 0;
        backdrop.style.right = 0;
        backdrop.style.bottom = 0;

        document.body.appendChild(backdrop);

        highlighter.init();
    },

    shutdown() {
        highlighter.shutdown();
        document.body.removeChild(backdrop);

        onHover = null;
        onSelect = null;
        currentDomNode = null;
        backdrop = null;
    },

    enable(onHoverCb, onSelectCb) {
        onHover = onHoverCb;
        onSelect = onSelectCb;

        backdrop.addEventListener('mousedown', blockEvent, false);
        backdrop.addEventListener('mousemove', onMouseMove, false);
        backdrop.addEventListener('mouseout', onMouseOut, false);
        backdrop.addEventListener('click', onClick, false);
        backdrop.style.display = 'block';
    },

    disable() {
        backdrop.removeEventListener('mousedown', blockEvent);
        backdrop.removeEventListener('mousemove', onMouseMove);
        backdrop.removeEventListener('mouseout', onMouseOut);
        backdrop.removeEventListener('click', onClick);

        onHover = null;
        onSelect = null;
        backdrop.style.display = 'none';
        highlighter.unhighlight();
    }
};
