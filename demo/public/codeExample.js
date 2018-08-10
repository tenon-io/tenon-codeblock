import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter, {
    registerLanguage
} from 'react-syntax-highlighter/prism-light';
import javascript from 'react-syntax-highlighter/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import json from 'react-syntax-highlighter/languages/prism/json';
import { atomDark } from 'react-syntax-highlighter/styles/prism';

class CodeBlock extends Component {
    static propTypes = {
        file: PropTypes.string.isRequired
    };

    state = {
        codeString: ''
    };

    componentDidMount() {
        registerLanguage('jsx', jsx);
        registerLanguage('javascript', javascript);
        registerLanguage('json', json);
        this.fetchFile();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.file !== this.props.file) {
            this.fetchFile();
        }
    }

    fetchFile = () => {
        const codeFile = new XMLHttpRequest();
        codeFile.open('GET', this.props.file, false);
        codeFile.onreadystatechange = () => {
            if (codeFile.readyState === 4) {
                if (codeFile.status === 200 || codeFile.status === 0) {
                    this.setState({ codeString: codeFile.responseText });
                }
            }
        };
        codeFile.send(null);
    };

    render() {
        //And here is a comment
        const test = true;
        const { codeString } = this.state;
        const customTheme = Object.assign({}, atomDark, {
            comment: { color: '#FFFFFF' }
        });
        console.log(customTheme);
        return codeString ? (
            <SyntaxHighlighter language="javascript" style={customTheme}>
                {codeString}
            </SyntaxHighlighter>
        ) : null;
    }
}

export default CodeBlock;
