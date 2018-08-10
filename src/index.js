import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter, {
    registerLanguage
} from 'react-syntax-highlighter/prism-light';
import javascript from 'react-syntax-highlighter/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import json from 'react-syntax-highlighter/languages/prism/json';
import { atomDark } from 'react-syntax-highlighter/styles/prism';
import axios from 'axios';

/**
 * @component
 * Code highligher component using react-syntax-highlighter, but tweaked for
 * accessibility.
 *
 * Takes a filename containing the code to show and an optional language setting.
 * If no language setting is given, the component defaults to JSX.
 *
 * @prop required {string} file - The path to the file to load.
 * @prop {string} language - Select a highlighter for jsx | javascript | html | json.
 *  */
class CodeBlock extends Component {
    static propTypes = {
        file: PropTypes.string.isRequired,
        language: PropTypes.oneOf(['javascript', 'jsx', 'json', 'html'])
    };

    customTheme = atomDark;

    state = {
        codeString: ''
    };

    /**
     * @function
     * Configures react-syntax-highlighter for the supported languages
     * in order to minimise the footprint of the component.
     *
     * Also overrides some colour settings for accessibility.
     *
     * Finally fetches the file from the server.
     */
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

        this.fetchFile();
    }

    /**
     * @function
     * Refetches the file when the filename changes.
     *
     * @param {object} prevProps
     */
    componentDidUpdate(prevProps) {
        if (prevProps.file !== this.props.file) {
            this.fetchFile();
        }
    }

    /**
     * @function
     * Event handler for onBlur of the <code> tag. Due to the tag
     * being set as contenteditable, the user can accidentally
     * edit the code. This resets the code on blur to ensure a more
     * stable interface;
     */
    onBlurHandler = () => {
        const oldCodeString = this.state.codeString;
        this.setState({ codeString: '' }, () => {
            this.setState({ codeString: oldCodeString });
        });
    };

    /**
     * @function
     * Event handler for the onFocus of the <code> tag. With the tag
     * being set to contenteditable, this autoselects the code text
     * on focus.
     *
     * @param {SyntheticEvent} e
     */
    onFocusHandler = e => {
        const range = document.createRange();
        range.selectNodeContents(e.target);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    };

    /**
     * @function
     *
     * GETs the file from the server and sets the content to the
     * component state.
     */
    fetchFile = () => {
        axios.get(this.props.file).then(({ data }) => {
            this.setState({ codeString: data });
        });
    };

    /**
     * @function
     * Render function. Please note that the following changes to the <code> tag:
     *
     * 1.The tag is made contenteditable to allow better keyboard interaction for
     * keyboard users. Due to this the suppressContentEditableWarning flag must be
     * set for React to avoid console warnings.
     *
     * 2. The tag is given a tabindex of 0 to make it easier to select.
     *
     * 3. Spellcheck is set to false to avoid browsers from spellchecking the
     * code text.
     *
     * @returns {React.Node}
     */
    render() {
        const { codeString } = this.state;

        return codeString ? (
            <div id="codeblock">
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
