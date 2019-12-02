import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/theme/vibrant_ink';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';

function Editor({ onChange, onLoad, content }) {
    return (
        <AceEditor
            onLoad={onLoad}
            mode="html"
            theme="vibrant_ink"
            fontSize={20}
            name="editor"
            height="100vh"
            width="100vw"
            value={content}
            highlightActiveLine={false}
            showPrintMargin={false}
            setOptions={{
                useWorker: false,
                showFoldWidgets: false,
            }}
            session="manual"
            editorProps={{ $blockScrolling: Infinity }}
            onChange={onChange}
        />
    );
}

export default Editor;
