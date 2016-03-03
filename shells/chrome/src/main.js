import checkForVidom from './checkForVidom';

let hasPanel = false;

function detectVidom() {
    checkForVidom(pageHasVidom => {
        if(pageHasVidom) {
            if(!hasPanel) {
                hasPanel = true;
                clearInterval(checkForVidomInterval);
                createVidomPanel();
            }
        }
    });
}

function createVidomPanel() {
    chrome.devtools.panels.create('Vidom', '', 'panel.html', panel => {
        let win = null;
        panel.onShown.addListener(window => {
            win = window;
        });

        panel.onHidden.addListener(() => {
            win.postMessage({ type : 'pause' }, '*');
        })
    });
}

const checkForVidomInterval = setInterval(detectVidom, 1000);

detectVidom();
