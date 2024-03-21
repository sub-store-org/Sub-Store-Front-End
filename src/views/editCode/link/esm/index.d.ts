import { ViewPlugin, DecorationSet, MatchDecorator, ViewUpdate } from '@codemirror/view';
import { Extension } from '@codemirror/state';
export interface HyperLinkState {
    at: number;
    url: string;
    anchor: HyperLinkExtensionOptions['anchor'];
}
export type HyperLinkExtensionOptions = {
    regexp?: RegExp;
    match?: Record<string, string>;
    handle?: (value: string, input: string, from: number, to: number) => string;
    anchor?: (dom: HTMLAnchorElement) => HTMLAnchorElement;
};
export declare function hyperLinkExtension({ regexp, match, handle, anchor }?: HyperLinkExtensionOptions): ViewPlugin<{
    decorator?: MatchDecorator | undefined;
    decorations: DecorationSet;
    update(update: ViewUpdate): void;
}>;
export declare const hyperLinkStyle: Extension;
export declare const hyperLink: Extension;
