import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import CodeBlock from '../index';
import axios from 'axios';

describe('CodeBlock', () => {
    afterEach(cleanup);

    it('should render and decorate the code tag with the correct attributes', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: '<div>some code</div>'
            })
        );

        const { container } = await render(<CodeBlock file="/test/file.js" />);

        expect(axios.get).toHaveBeenCalledWith('/test/file.js');

        const codeBlock = container.querySelector('code');
        expect(codeBlock).toHaveAttribute('contenteditable', 'true');
        expect(codeBlock).toHaveAttribute('tabindex', '0');
        expect(codeBlock).toHaveAttribute('spellcheck', 'false');
    });

    it('should render a code block for JSX', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data:
                    "import React, { Component } from 'react';\n" +
                    "import PropTypes from 'prop-types';\n" +
                    'import SyntaxHighlighter, {\n' +
                    '    registerLanguage\n' +
                    "} from 'react-syntax-highlighter/prism-light';\n" +
                    "import javascript from 'react-syntax-highlighter/languages/prism/javascript';\n" +
                    "import jsx from 'react-syntax-highlighter/languages/prism/jsx';\n" +
                    "import json from 'react-syntax-highlighter/languages/prism/json';\n" +
                    "import { atomDark } from 'react-syntax-highlighter/styles/prism';\n" +
                    '\n' +
                    'class CodeBlock extends Component {\n' +
                    '    static propTypes = {\n' +
                    '        file: PropTypes.string.isRequired\n' +
                    '    };\n' +
                    '\n' +
                    '    state = {\n' +
                    "        codeString: ''\n" +
                    '    };\n' +
                    '\n' +
                    '    componentDidMount() {\n' +
                    "        registerLanguage('jsx', jsx);\n" +
                    "        registerLanguage('javascript', javascript);\n" +
                    "        registerLanguage('json', json);\n" +
                    '        this.fetchFile();\n' +
                    '    }\n' +
                    '\n' +
                    '    componentDidUpdate(prevProps) {\n' +
                    '        if (prevProps.file !== this.props.file) {\n' +
                    '            this.fetchFile();\n' +
                    '        }\n' +
                    '    }\n' +
                    '\n' +
                    '    fetchFile = () => {\n' +
                    '        const codeFile = new XMLHttpRequest();\n' +
                    "        codeFile.open('GET', this.props.file, false);\n" +
                    '        codeFile.onreadystatechange = () => {\n' +
                    '            if (codeFile.readyState === 4) {\n' +
                    '                if (codeFile.status === 200 || codeFile.status === 0) {\n' +
                    '                    this.setState({ codeString: codeFile.responseText });\n' +
                    '                }\n' +
                    '            }\n' +
                    '        };\n' +
                    '        codeFile.send(null);\n' +
                    '    };\n' +
                    '\n' +
                    '    render() {\n' +
                    '        //And here is a comment\n' +
                    '        const test = true;\n' +
                    '        const { codeString } = this.state;\n' +
                    '        const customTheme = Object.assign({}, atomDark, {\n' +
                    "            comment: { color: '#FFFFFF' }\n" +
                    '        });\n' +
                    '        console.log(customTheme);\n' +
                    '        return codeString ? (\n' +
                    '            <SyntaxHighlighter language="javascript" style={customTheme}>\n' +
                    '                {codeString}\n' +
                    '            </SyntaxHighlighter>\n' +
                    '        ) : null;\n' +
                    '    }\n' +
                    '}\n' +
                    '\n' +
                    'export default CodeBlock;\n'
            })
        );

        const { container } = await render(
            <CodeBlock file="/test/file.js" language="jsx" />
        );

        expect(container).toMatchSnapshot();
    });

    it('should render a code block for javascript', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data:
                    'onKeyUpHandler = e => {\n' +
                    '        const { activeTabId } = this.state;\n' +
                    '        const currentSelectedIndex = this.tabsById.reduce(\n' +
                    '            (prev, cur, index) => (cur.tabId === activeTabId ? index : prev),\n' +
                    '            0\n' +
                    '        );\n' +
                    '\n' +
                    '        let newIndex = 0;\n' +
                    '\n' +
                    '        switch (getKey(e)) {\n' +
                    '            case keyNames.ArrowLeft:\n' +
                    '                newIndex =\n' +
                    '                    currentSelectedIndex > 0\n' +
                    '                        ? currentSelectedIndex - 1\n' +
                    '                        : this.tabsById.length - 1;\n' +
                    '                break;\n' +
                    '            case keyNames.ArrowRight:\n' +
                    '                newIndex =\n' +
                    '                    currentSelectedIndex === this.tabsById.length - 1\n' +
                    '                        ? 0\n' +
                    '                        : currentSelectedIndex + 1;\n' +
                    '                break;\n' +
                    '            case keyNames.ArrowDown:\n' +
                    '                this.panelRefs[activeTabId || this.tabsById[0].tabId].focus();\n' +
                    '                return;\n' +
                    '            default:\n' +
                    '                return;\n' +
                    '        }\n' +
                    '\n' +
                    '        this.setState(\n' +
                    '            {\n' +
                    '                activeTabId: this.tabsById[newIndex].tabId\n' +
                    '            },\n' +
                    '            () => {\n' +
                    '                this.tabRefs[this.tabsById[newIndex].tabId].focus();\n' +
                    '            }\n' +
                    '        );\n' +
                    '    };'
            })
        );

        const { container } = await render(
            <CodeBlock file="/test/file.js" language="javascript" />
        );

        expect(container).toMatchSnapshot();
    });

    it('should render a code block for json', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data:
                    ' \'code[class*="language-"]\': {\n' +
                    "                color: '#c5c8c6',\n" +
                    "                textShadow: '0 1px rgba(0, 0, 0, 0.3)',\n" +
                    '                fontFamily:\n' +
                    '                    "Inconsolata, Monaco, Consolas, \'Courier New\', Courier, monospace",\n' +
                    "                direction: 'ltr',\n" +
                    "                textAlign: 'left',\n" +
                    "                whiteSpace: 'pre',\n" +
                    "                wordSpacing: 'normal',\n" +
                    "                wordBreak: 'normal',\n" +
                    "                lineHeight: '1.5',\n" +
                    "                MozTabSize: '4',\n" +
                    "                OTabSize: '4',\n" +
                    "                tabSize: '4',\n" +
                    "                WebkitHyphens: 'none',\n" +
                    "                MozHyphens: 'none',\n" +
                    "                msHyphens: 'none',\n" +
                    "                hyphens: 'none'\n" +
                    '            },\n' +
                    '            \'pre[class*="language-"]\': {\n' +
                    "                color: '#c5c8c6',\n" +
                    "                textShadow: '0 1px rgba(0, 0, 0, 0.3)',\n" +
                    '                fontFamily:\n' +
                    '                    "Inconsolata, Monaco, Consolas, \'Courier New\', Courier, monospace",\n' +
                    "                direction: 'ltr',\n" +
                    "                textAlign: 'left',\n" +
                    "                whiteSpace: 'pre',\n" +
                    "                wordSpacing: 'normal',\n" +
                    "                wordBreak: 'normal',\n" +
                    "                lineHeight: '1.5',\n" +
                    "                MozTabSize: '4',\n" +
                    "                OTabSize: '4',\n" +
                    "                tabSize: '4',\n" +
                    "                WebkitHyphens: 'none',\n" +
                    "                MozHyphens: 'none',\n" +
                    "                msHyphens: 'none',\n" +
                    "                hyphens: 'none',\n" +
                    "                padding: '1em',\n" +
                    "                margin: '.5em 0',\n" +
                    "                overflow: 'auto',\n" +
                    "                borderRadius: '0.3em',\n" +
                    "                background: '#1d1f21'\n" +
                    '            },\n' +
                    '            \':not(pre) > code[class*="language-"]\': {\n' +
                    "                background: '#1d1f21',\n" +
                    "                padding: '.1em',\n" +
                    "                borderRadius: '.3em'\n" +
                    '            },\n' +
                    "            comment: { color: '#FFFFFF' },\n" +
                    "            prolog: { color: '#7C7C7C' },\n" +
                    "            doctype: { color: '#7C7C7C' },\n" +
                    "            cdata: { color: '#7C7C7C' },\n" +
                    "            punctuation: { color: '#c5c8c6' },\n" +
                    "            '.namespace': { Opacity: '.7' },\n" +
                    "            property: { color: '#96CBFE' },\n" +
                    "            keyword: { color: '#96CBFE' },\n" +
                    "            tag: { color: '#96CBFE' },\n" +
                    "            'class-name': { color: '#FFFFB6', textDecoration: 'underline' },\n" +
                    "            boolean: { color: '#99CC99' },\n" +
                    "            constant: { color: '#99CC99' },\n" +
                    "            symbol: { color: '#f92672' },\n" +
                    "            deleted: { color: '#f92672' },\n" +
                    "            number: { color: '#FF82FC' },\n" +
                    "            selector: { color: '#A8FF60' },\n" +
                    "            'attr-name': { color: '#A8FF60' },\n" +
                    "            string: { color: '#A8FF60' },\n" +
                    "            char: { color: '#A8FF60' },\n" +
                    "            builtin: { color: '#A8FF60' },\n" +
                    "            inserted: { color: '#A8FF60' },\n" +
                    "            variable: { color: '#C6C5FE' },\n" +
                    "            operator: { color: '#EDEDED' },\n" +
                    "            entity: { color: '#FFFFB6', cursor: 'help' },\n" +
                    "            url: { color: '#96CBFE' },\n" +
                    "            '.language-css .token.string': { color: '#87C38A' },\n" +
                    "            '.style .token.string': { color: '#87C38A' },\n" +
                    "            atrule: { color: '#F9EE98' },\n" +
                    "            'attr-value': { color: '#F9EE98' },\n" +
                    "            function: { color: '#DAD085' },\n" +
                    "            regex: { color: '#E9C062' },\n" +
                    "            important: { color: '#fd971f', fontWeight: 'bold' },\n" +
                    "            bold: { fontWeight: 'bold' },\n" +
                    "            italic: { fontStyle: 'italic' }"
            })
        );

        const { container } = await render(
            <CodeBlock file="/test/file.js" language="json" />
        );

        expect(container).toMatchSnapshot();
    });

    it('should render a code block for html', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data:
                    '<div tabindex="-1" role="group" style="outline: none;">\n' +
                    '    <ul role="tablist">\n' +
                    '        <li role="presentation">\n' +
                    '            <div id="ec833728-4251-44f2-9742-7f2f5c3ac93c" role="tab" tabindex="0"\n' +
                    '                 aria-controls="407e51c0-47f1-4c2c-8475-decda409006e" aria-selected="true"><span>Panel 1</span></div>\n' +
                    '        </li>\n' +
                    '        <li role="presentation">\n' +
                    '            <div id="78af9472-22ac-4bc8-bdd0-6a1f781a07f3" role="tab" tabindex="-1"\n' +
                    '                 aria-controls="d73309f4-60a8-4124-b42e-3a8b9b6d7ee2"><span>Panel 2</span></div>\n' +
                    '        </li>\n' +
                    '        <li role="presentation">\n' +
                    '            <div id="907133b7-3a8f-48de-9d3d-465692a0b633" role="tab" tabindex="-1"\n' +
                    '                 aria-controls="b5979aec-405a-434a-a759-62bb4eeb3a05"><span>Panel 3</span></div>\n' +
                    '        </li>\n' +
                    '        <li role="presentation">\n' +
                    '            <div id="565cb652-2579-4e14-b2cc-898d5d631f79" role="tab" tabindex="-1"\n' +
                    '                 aria-controls="79a8979c-2c98-48a1-b30e-97ea507eaeda"><span>Panel 4</span></div>\n' +
                    '        </li>\n' +
                    '    </ul>\n' +
                    '    <section id="407e51c0-47f1-4c2c-8475-decda409006e" role="tabpanel" tabindex="0"\n' +
                    '             aria-describedby="ec833728-4251-44f2-9742-7f2f5c3ac93c"><h2>Panel 1</h2>\n' +
                    '        <p>You are on the first panel</p></section>\n' +
                    '    <section id="d73309f4-60a8-4124-b42e-3a8b9b6d7ee2" role="tabpanel" tabindex="0"\n' +
                    '             aria-describedby="78af9472-22ac-4bc8-bdd0-6a1f781a07f3" hidden=""><h2>Panel 2</h2>\n' +
                    '        <p>You are on the second panel</p></section>\n' +
                    '    <section id="b5979aec-405a-434a-a759-62bb4eeb3a05" role="tabpanel" tabindex="0"\n' +
                    '             aria-describedby="907133b7-3a8f-48de-9d3d-465692a0b633" hidden=""><h2>Panel 3</h2>\n' +
                    '        <p>You are on the third panel</p></section>\n' +
                    '    <section id="79a8979c-2c98-48a1-b30e-97ea507eaeda" role="tabpanel" tabindex="0"\n' +
                    '             aria-describedby="565cb652-2579-4e14-b2cc-898d5d631f79" hidden=""><h2>Panel 4</h2>\n' +
                    '        <p>You are on the fourth panel</p></section>\n' +
                    '    <button>Change</button>\n' +
                    '</div>'
            })
        );

        const { container } = await render(
            <CodeBlock file="/test/file.js" language="html" />
        );

        expect(container).toMatchSnapshot();
    });

    it('should replace the old text content on blur', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: '<div>some code</div>'
            })
        );

        const { container } = await render(<CodeBlock file="/test/file.js" />);

        const codeBlock = container.querySelector('code');
        expect(codeBlock.innerHTML).toContain('some code');
        codeBlock.innerHTML = '';
        expect(codeBlock.innerHTML).not.toContain('some code');
        fireEvent.blur(codeBlock);
        const adjustedCodeBlock = container.querySelector('code');
        expect(adjustedCodeBlock.innerHTML).toContain('some code');
    });

    it('should autoselect the code example on focus', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: '<div>some code</div>'
            })
        );

        const { container } = await render(<CodeBlock file="/test/file.js" />);

        const codeBlock = container.querySelector('code');

        //mock window.getSelection
        const oldGetSelection = window.getSelection;

        const removeAllRangesMock = jest.fn();
        const addRangeMock = jest.fn();

        window.getSelection = () => ({
            removeAllRanges: removeAllRangesMock,
            addRange: addRangeMock
        });

        //mock document.createRange
        const oldCreateRange = document.createRange;

        function CreateRange(content) {
            this.content = content;
        }

        CreateRange.prototype.selectNodeContents = function(target) {
            this.content = target.textContent;
        };

        document.createRange = () => new CreateRange();

        fireEvent.focus(codeBlock, { target: codeBlock });

        expect(removeAllRangesMock).toHaveBeenCalled();
        expect(addRangeMock).toHaveBeenCalledWith({
            content: '<div>some code</div>'
        });

        window.getSelection = oldGetSelection;
        document.createRange = oldCreateRange;
    });

    it('should render without error for both no file and no codeString given', async () => {
        const { container } = await render(<CodeBlock />);

        expect(container.querySelector('code')).toBeNull();
    });

    it('should pass a class through to the container', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: '<div>some code</div>'
            })
        );

        const { container } = await render(
            <CodeBlock className="test-class" file="/test/file.js" />
        );

        expect(container.querySelector('div')).toHaveAttribute(
            'class',
            'test-class'
        );
    });
});

describe('CodeBlock with file property', () => {
    afterEach(cleanup);

    it('should update the code block when the input file changes', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: '<div>some code</div>'
            })
        );

        const { rerender } = await render(<CodeBlock file="/test/file.js" />);

        expect(axios.get).toHaveBeenCalledWith('/test/file.js');

        axios.get.mockClear();

        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: '<div>some code</div>'
            })
        );

        rerender(<CodeBlock file="/test/someotherfile.html" />);

        expect(axios.get).toHaveBeenCalledWith('/test/someotherfile.html');
    });

    it('should call the onReset handler only when the contents is changed', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: '<div>some code</div>'
            })
        );

        const mockResetHandler = jest.fn();

        const { container } = await render(
            <CodeBlock file="/test/file.js" onReset={mockResetHandler} />
        );

        let codeBlock = container.querySelector('code');
        fireEvent.blur(codeBlock);
        expect(mockResetHandler).not.toHaveBeenCalled();

        codeBlock = container.querySelector('code');
        codeBlock.innerHTML = '';
        fireEvent.blur(codeBlock);
        expect(mockResetHandler).toHaveBeenCalled();
    });
});

describe('CodeBlock with codeString property', () => {
    afterEach(cleanup);

    it('should update the code block when the input file changes', () => {
        const { rerender, queryByText } = render(
            <CodeBlock codeString={'<span>Demo</span>'} />
        );

        expect(queryByText('Demo')).not.toBeNull();

        rerender(<CodeBlock codeString={'<span>Changed</span>'} />);
        expect(queryByText('Demo')).toBeNull();
        expect(queryByText('Changed')).not.toBeNull();
    });

    it('should call the onReset handler only when the contents is changed', () => {
        const mockResetHandler = jest.fn();

        const { container } = render(
            <CodeBlock
                codeString={'<span>Demo</span>'}
                onReset={mockResetHandler}
            />
        );

        let codeBlock = container.querySelector('code');
        fireEvent.blur(codeBlock);
        expect(mockResetHandler).not.toHaveBeenCalled();

        codeBlock = container.querySelector('code');
        codeBlock.innerHTML = '';
        fireEvent.blur(codeBlock);
        expect(mockResetHandler).toHaveBeenCalled();
    });
});
