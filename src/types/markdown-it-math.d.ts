declare module 'markdown-it-math' {
    import MarkdownIt from 'markdown-it';

    interface MarkdownItMathOptions {
        inlineOpen?: string;
        inlineClose?: string;
        blockOpen?: string;
        blockClose?: string;
    }

    function markdownItMath(md: MarkdownIt, options?: MarkdownItMathOptions): void;
    export default markdownItMath;
} 