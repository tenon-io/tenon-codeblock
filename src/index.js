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

/**
 * @component
 * Code highligher component using react-syntax-highlighter, but tweaked for
 * accessibility.
 *
 * Takes a filename containing the code to show and an optional language setting.
 * If no language setting is given, the component defaults to JSX.
 *
 * It also allows a free text codeString to be given. If both are set, file will
 * override codeString
 *
 * This code block will autoreset any changes to the contenteditable <code>
 * tag and, if the user made any changes before the reset, the onRest
 * handler will be called.
 *
 * @prop {string} file - The path to the file to load.
 * @prop {string} codeString - A string value containing code to display.
 * @prop {string} language - Select a highlighter for jsx | javascript | html | json.
 * @prop {function} onReset - A callback function to execute when changes to the
 *          contenteditable section is reverted.
 *  */
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

        this.setText();
    }

    /**
     * @function
     * Resets the code text when the filename or codeString changes.
     *
     * @param {object} prevProps
     */
    componentDidUpdate(prevProps) {
        if (
            prevProps.file !== this.props.file ||
            prevProps.codeString !== this.props.codeString
        ) {
            this.setText();
        }
    }

    /**
     * @function
     * Event handler for onBlur of the <code> tag. Due to the tag
     * being set as contenteditable, the user can accidentally
     * edit the code. This resets the code on blur to ensure a more
     * stable interface;
     *
     * It also checks whether the user had changed the tag content.
     * If so the onReset handler is called.
     *
     * The implementation here is to allow for IE support.
     */
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
     * If a file is given it GETs the file from the server and
     * sets the content to the component state.
     *
     * Alternatively if a codeString is given, it is set to the
     * component state. This is an intentional duplication of
     * the prop into the state so that the mechanism can be
     * re-used without code duplication.
     */
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
        const { className } = this.props;

        return codeString ? (
            <div
                className={className ? className : null}
                ref={this.codeBlockFrame}
            >
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
