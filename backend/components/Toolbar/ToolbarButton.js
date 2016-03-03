import bem from 'b_';

const b = bem.with('ToolbarButton');

export default function ToolbarButton({ iconId, title, onClick }) {
    return (
        <button class={ b() } title={ title } onClick={ onClick }>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class={ b('icon') }>
                { iconRenderers[iconId]() }
            </svg>
        </button>
    );
}

const iconRenderers = {
    'selector-disabled' : function() {
        return (
            <path
                d="M2 2 h12 v6 m-6 6 h-6 v-13 M14 14 l-7 -7 m-1 0 v4 m-1 -5 h6"
                stroke-width="2"
                fill="transparent"
                stroke="#333"
            />
        );
    },

    'selector-enabled' : function() {
        return (
            <path
                d="M2 2 h12 v6 m-6 6 h-6 v-13 M14 14 l-7 -7 m-1 0 v4 m-1 -5 h6"
                stroke-width="2"
                fill="transparent"
                stroke="#407ce3"
            />
        );
    }
};
