let highlighter = null,
    tooltip = null;

export default {
    init() {
        if(highlighter) {
            return;
        }

        highlighter = document.createElement('div');
        highlighter.style.display = 'none';
        highlighter.style.position = 'fixed';
        highlighter.style.zIndex = '10000';
        highlighter.style.background = 'rgba(76, 158, 217, .4)';

        tooltip = document.createElement('div');
        tooltip.style.display = 'none';
        tooltip.style.position = 'fixed';
        tooltip.style.zIndex = '10000';
        tooltip.style.background = '#ffee8f';
        tooltip.style.borderRadius = '3px';
        tooltip.style.padding = '2px 4px';
        tooltip.style.font = '10px Verdana';
        tooltip.style.margin = '2px';
        tooltip.style.webkitUserSelect = 'none';

        document.body.appendChild(highlighter);
        document.body.appendChild(tooltip);
    },

    shutdown() {
        if(!highlighter) {
            return;
        }

        document.body.removeChild(highlighter);
        document.body.removeChild(tooltip);

        highlighter = null;
        tooltip = null;
    },

    highlight(domNode) {
        const rect = getBoundingClientRect(domNode);

        if(!rect) {
            return;
        }

        const { left, top, width, height } = rect,
            { innerWidth : viewportWidth, innerHeight : viewportHeight } = window;

        highlighter.style.left = left + 'px';
        highlighter.style.top = top + 'px';
        highlighter.style.width = width + 'px';
        highlighter.style.height = height + 'px';
        highlighter.style.display = 'block';

        if(left > viewportWidth) {
            tooltip.style.left = 'auto';
            tooltip.style.right = '0';
        }
        else if(left <= 0) {
            tooltip.style.right = 'auto';
            tooltip.style.left = '0';
        }
        else if(left > viewportWidth / 2) {
            tooltip.style.left = 'auto';
            tooltip.style.right = viewportWidth - left + 'px';
        }
        else {
            tooltip.style.left = left + 'px';
            tooltip.style.right = 'auto';
        }

        if(top > viewportHeight) {
            tooltip.style.top = 'auto';
            tooltip.style.bottom = '0';
        }
        else if(top <= 0) {
            tooltip.style.bottom = 'auto';
            tooltip.style.top = '0';
        }
        else if(top > viewportHeight / 2) {
            tooltip.style.top = 'auto';
            tooltip.style.bottom = viewportHeight - top + 'px';
        }
        else {
            tooltip.style.bottom = 'auto';
            tooltip.style.top = top + height + 'px';
        }

        tooltip.style.display = 'block';
        tooltip.textContent = Math.round(width) + '×' + Math.round(height);
    },

    unhighlight() {
        highlighter.style.display = 'none';
        tooltip.style.display = 'none';
    },

    show(domNode) {
        scrollIntoView(domNode);
        this.highlight(domNode);
    }
};

function getBoundingClientRect(domNode) {
    if(Array.isArray(domNode)) {
        let left,
            top,
            right,
            bottom,
            currentChild = domNode[0],
            childRect;
        const lastChild = domNode[1];

        while(currentChild !== lastChild) {
            if(currentChild.nodeType === Node.ELEMENT_NODE) {
                childRect = currentChild.getBoundingClientRect();

                if(typeof left === 'undefined' || childRect.left < left) {
                    left = childRect.left;
                }

                if(typeof top === 'undefined' || childRect.top < top) {
                    top = childRect.top;
                }

                if(typeof right === 'undefined' || childRect.right > right) {
                    right = childRect.right;
                }

                if(typeof bottom === 'undefined' || childRect.bottom > bottom) {
                    bottom = childRect.bottom;
                }
            }

            currentChild = currentChild.nextSibling;
        }

        return typeof left === 'undefined'?
            null :
            {
                left,
                top,
                width : right - left,
                height : bottom - top
            };
    }

    return domNode.getBoundingClientRect();
}

function scrollIntoView(domNode) {
    if(Array.isArray(domNode)) {
        domNode = domNode[0];
    }

    domNode.scrollIntoView();
}
