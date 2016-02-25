const highlighter = document.createElement('div'),
    tooltip = document.createElement('div');

highlighter.style.display = 'none';
highlighter.style.position = 'fixed';
highlighter.style.background = 'rgba(76, 158, 217, .2)';

tooltip.style.display = 'none';
tooltip.style.position = 'fixed';
tooltip.style.background = '#ffee8f';
tooltip.style.borderRadius = '3px';
tooltip.style.padding = '2px 4px';
tooltip.style.font = '10px Verdana';
tooltip.style.margin = '2px';

document.body.appendChild(highlighter);
document.body.appendChild(tooltip);

export default {
    highlight(domNode) {
        const { left, top, width, height } = domNode.getBoundingClientRect(),
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
        else if(left < 0 || left + width > viewportWidth) {
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
        else if(top < 0 || top + height > viewportHeight) {
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
        domNode.scrollIntoView();
        this.highlight(domNode);
    }
};
