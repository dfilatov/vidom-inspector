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
    chrome.devtools.panels.create('Vidom', '', 'panel.html');
}

const checkForVidomInterval = setInterval(detectVidom, 1000);

detectVidom();
