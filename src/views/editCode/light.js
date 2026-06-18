import { EditorView } from '@codemirror/view';

const config = {
    name: 'lightCode',
    dark: false,
    background: '#00000000',
    foreground: '#444d56',
    selection: '#0366d625',
    cursor: '#044289',
    dropdownBackground: '#fff',
    dropdownBorder: '#e1e4e8',
    activeLine: '#c6c6c622',
    matchingBracket: '#34d05840',

    keyword: '#db2072',
    storage: '#e34554',

    variable: '#302b31',   
    parameter: '#24292e',
    function: '#6669b4',
    string: '#87a6cc', 
    constant: '#6639ba',
    type: '#6639ba',
    class: '#6f42c1',
    number: '#de5d5d',
    comment: '#99a8b9',
    heading: '#6639ba',
    invalid: '#cb2431',
    regexp: '#7f99b8',
    
};

const  lightCodeTheme = EditorView.theme({
    '&': {
        color: config.foreground,
        backgroundColor: config.background,
    },
    '.cm-content': { caretColor: config.cursor },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: config.cursor },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: config.selection },
    '.cm-panels': { backgroundColor: config.dropdownBackground, color: config.foreground },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
        backgroundColor: '#ffff0054',
        outline: `1px solid #87a6cc`
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
        backgroundColor: config.selection
    },
    '.cm-activeLine': { backgroundColor: config.activeLine },
    '.cm-selectionMatch': { backgroundColor: config.selection },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
        backgroundColor: config.matchingBracket,
        outline: 'none'
    },
    '.cm-gutters': {
        backgroundColor: config.background,
        color: config.foreground,
        border: 'none'
    },
    '.cm-activeLineGutter': { backgroundColor: config.background },
    '.cm-line span:not(.cm-shiki-token)': {
        color: 'inherit !important'
    },
    '.cm-shiki-token *': {
        color: 'inherit !important'
    },
    '.cm-foldPlaceholder': {
        backgroundColor: 'transparent',
        border: 'none',
        color: config.foreground
    },
    '.cm-tooltip': {
        border: `1px solid ${config.dropdownBorder}`,
        backgroundColor: config.dropdownBackground,
        color: config.foreground,
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
        borderTopColor: config.foreground,
        borderBottomColor: config.foreground,
    },
    '.cm-tooltip-autocomplete': {
        '& > ul > li[aria-selected]': {
            background: config.selection,
            color: config.foreground,
        }
    }
}, { dark: config.dark });
const  lightCode = [
     lightCodeTheme,
];

export { config,  lightCode,  lightCodeTheme };
