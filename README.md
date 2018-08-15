# tenon-codeblock

This is an accessible code-block component, built in React, for displaying styled code snippets in your application.

It is part of the `tenon-ui` toolkit.

The code block is built on [react-syntax-highlighter](https://github.com/conorhastings/react-syntax-highlighter)
with some contrast tweaks for accessibility and helpers to assist keyboard navigation.

**Features:**

-   Contrast rich color scheme for accessibility.
-   Easily focussable when navigating with TAB.
-   Autoselects text on focus.
-   Use either a file or a code string.

##Install

`npm install @tenon-io/tenon-codeblock`

or

`yarn add @tenon-io/tenon-codeblock`

##Usage

###With a source file

The `tenon-codeblock` will autofetch a file hosted on your server and display the contents. This
allows easy display of code files and ensuring that online examples remain up-to-date.

With a file called `tabs.js` hosted in the `/code/examples` path of your website, the code 
block is used as:

```javascript
import CodeBlock from '@tenon-io/tenon-codeblock'
//...
<CodeBlock file="/code/examples/tabs.js" />
//...
```

###With a source string

```javascript
import CodeBlock from '@tenon-io/tenon-codeblock'
//...
const codeString =
    '   <section>\n' +
    '      <h2>Code block reading from a file</h2>\n' +
    '      <CodeBlock\n' +
    '          file="codeExample.js"\n' +
    '          onReset={() => {\n' +
    "               console.log('reset 2');\n" +
    '          }}\n' +
    '      />\n' +
    '   </section>\n';
//...
<CodeBlock codeString={codeString} />;
//...
```

##Languages

The code block supports the following languages:

-   JSX
-   javascript
-   html
-   json

By default the code block is configured for `JSX`. To set this to another language
use the `language` prop.

```
<CodeBlock file="codeExample.js" language="javascript" />
```

##Auto undo of accidental edits

To support better interaction with the text, the code block is editable. Any accidental
changes the user makes is reset when the code block loses focus.

This may cause some unexpected content changes on your page so the code block exposes
an `onReset` event that gets fired if any changes are reset.

You can use this to signal to notify the user of this change in a way best suited
to your application.

```javascript
class MyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onResetHandler = this.onResetHandler.bind(this);
    }

    onResetHandler() {
        //Notify the user.
    }

    render() {
        return (
            <CodeBlock
                file="/code/examples/tabs.js"
                onReset={this.onResetHandler}
            />
        );
    }
}
```
