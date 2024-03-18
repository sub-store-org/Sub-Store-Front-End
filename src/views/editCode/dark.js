import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const config = {
    name: 'darkCode',
    dark: true,
    background: '#00000000', // 282c34
    foreground: '#abb2bf',
    selection: '#3E4451',
    cursor: '#528bff',
    dropdownBackground: '#21252b',
    dropdownBorder: '#457dff',
    activeLine: '#6699ff0b',
    matchingBracket: '#bad0f847',
    keyword: '#c678dd',
    // storage: '#d73a49',
    variable: '#e06c75',
    // parameter: '#24292e',
    function: '#61afef',
    string: '#98c379',
    constant: '#d19a66',
    type: '#e5c07b',
    class: '#e5c07b',
    number: '#d19966',
    comment: '#7d8799',
    heading: '#e06c75',
    invalid: '#ffffff',
    regexp: '#56b6c2',
};
const  darkCodeTheme = EditorView.theme({
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
        backgroundColor: config.dropdownBackground,
        outline: `1px solid ${config.dropdownBorder}`
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
const  darkCodeHighlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: config.keyword },
    { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: config.variable },
    { tag: [tags.propertyName], color: config.function },
    { tag: [tags.processingInstruction, tags.string, tags.inserted, tags.special(tags.string)], color: config.string },
    { tag: [tags.function(tags.variableName), tags.labelName], color: config.function },
    { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: config.constant },
    { tag: [tags.definition(tags.name), tags.separator], color: config.variable },
    { tag: [tags.className], color: config.class },
    { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: config.number },
    { tag: [tags.typeName], color: config.type, fontStyle: config.type },
    { tag: [tags.operator, tags.operatorKeyword], color: config.keyword },
    { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: config.regexp },
    { tag: [tags.meta, tags.comment], color: config.comment },
    { tag: tags.strong, fontWeight: 'bold' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.link, textDecoration: 'underline' },
    { tag: tags.heading, fontWeight: 'bold', color: config.heading },
    { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: config.variable },
    { tag: tags.invalid, color: config.invalid },
    { tag: tags.strikethrough, textDecoration: 'line-through' },
]);
const darkCode = [
     darkCodeTheme,
    syntaxHighlighting( darkCodeHighlightStyle),
];

export { config,  darkCode,  darkCodeHighlightStyle,  darkCodeTheme };
