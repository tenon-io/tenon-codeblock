import React, { Component, StrictMode } from 'react';
import CodeBlock from '../../src/index';

const codeText =
    '<StrictMode>\n' +
    '   <h1>Code block demo application</h1>\n' +
    '   <section>\n' +
    '      <h2>Code block with free text</h2>\n' +
    '      <CodeBlock\n' +
    "          codeString={'<div><span>test</span></div>'}\n" +
    '          onReset={() => {\n' +
    "               console.log('reset');\n" +
    '          }}\n' +
    '       />\n' +
    '   </section>\n' +
    '   <section>\n' +
    '      <h2>Code block reading from a file</h2>\n' +
    '      <CodeBlock\n' +
    '          file="codeExample.js"\n' +
    '          onReset={() => {\n' +
    "               console.log('reset 2');\n" +
    '          }}\n' +
    '      />\n' +
    '   </section>\n' +
    '</StrictMode>';

const htmlPartial = '<button type="button" class="somethi';

class App extends Component {
    render() {
        return (
            <StrictMode>
                <h1>Code block demo application</h1>
                <section>
                    <h2>Code block with free text</h2>
                    <CodeBlock
                        codeString={codeText}
                        onReset={() => {
                            console.log('reset');
                        }}
                    />
                </section>
                <section>
                    <h2>Code block reading from a file</h2>
                    <CodeBlock
                        file="codeExample.js"
                        onReset={() => {
                            console.log('reset 2');
                        }}
                    />
                </section>
                <CodeBlock />
                <CodeBlock
                    codeString={htmlPartial}
                    language="xml"
                    onReset={() => {
                        console.log('reset 2');
                    }}
                />
            </StrictMode>
        );
    }
}

export default App;
