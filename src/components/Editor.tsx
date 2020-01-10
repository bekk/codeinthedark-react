import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/theme/vibrant_ink';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';
import { DataProps } from '../App';

interface Props {
    onChange: (value: string, data: DataProps) => void;
    onLoad: (editor: any) => void;
    content: string;
}

function Editor({ onChange, onLoad, content }: Props) {
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
            editorProps={{ $blockScrolling: Infinity }}
            onChange={onChange}
        />
    );
}

export default Editor;
