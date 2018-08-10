import React, { Component, Fragment, StrictMode } from 'react';
import CodeBlock from '../../src/index';

class App extends Component {
    render() {
        return (
            <StrictMode>
                <CodeBlock file="codeExample.js" />
            </StrictMode>
        );
    }
}

export default App;
