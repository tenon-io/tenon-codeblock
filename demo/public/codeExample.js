import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter, {
    registerLanguage
} from 'react-syntax-highlighter/prism-light';
import javascript from 'react-syntax-highlighter/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import json from 'react-syntax-highlighter/languages/prism/json';
import { atomDark } from 'react-syntax-highlighter/styles/prism';
import axios from 'axios';

class CodeBlock extends Component {
    static propTypes = {
        file: PropTypes.string,
        codeString: PropTypes.string,
        language: PropTypes.oneOf(['javascript', 'jsx', 'json', 'html']),
        onReset: PropTypes.func
    };

    customTheme = atomDark;

    codeBlockFrame = createRef();
    loadedInnerHTMLString = '';

    state = {
        codeString: ''
    };

    componentDidMount() {
        registerLanguage('jsx', jsx);
        registerLanguage('javascript', javascript);
        registerLanguage('json', json);

        this.customTheme = {
            ...atomDark,
            comment: {
                color: '#FFFFFF'
            },
            number: {
                color: '#FF82FC'
            }
        };

        this.setText();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.file !== this.props.file ||
            prevProps.codeString !== this.props.codeString
        ) {
            this.setText();
        }
    }

    onBlurHandler = () => {
        const { onReset } = this.props;

        const oldCodeString = this.state.codeString;

        if (
            this.loadedInnerHTMLString !==
                this.codeBlockFrame.current
                    .querySelector('code')
                    .innerHTML.toString() &&
            onReset
        ) {
            onReset();
        }

        this.setState({ codeString: '' }, () => {
            this.setState({ codeString: oldCodeString });
        });
    };

    onFocusHandler = e => {
        const range = document.createRange();
        range.selectNodeContents(e.target);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    };

    setText = () => {
        const { file, codeString } = this.props;

        if (file) {
            axios.get(file).then(({ data }) => {
                this.setCodeString(data);
            });
        } else if (codeString) {
            this.setCodeString(codeString);
        }
    };

    setCodeString = codeString => {
        this.setState({ codeString }, () => {
            this.loadedInnerHTMLString = this.codeBlockFrame.current
                .querySelector('code')
                .innerHTML.toString();
        });
    };

    render() {
        const { codeString } = this.state;
        //with some comments
        const iAmBoolean = true;
        return codeString ? (
            <div id="codeblock" ref={this.codeBlockFrame}>
                <SyntaxHighlighter
                    language={this.props.language || 'jsx'}
                    style={this.customTheme}
                    codeTagProps={{
                        contentEditable: 'true',
                        suppressContentEditableWarning: 'true',
                        tabIndex: 0,
                        spellCheck: 'false',
                        onBlur: this.onBlurHandler,
                        onFocus: this.onFocusHandler
                    }}
                >
                    {codeString}
                </SyntaxHighlighter>
            </div>
        ) : null;
    }
}

export default CodeBlock;
