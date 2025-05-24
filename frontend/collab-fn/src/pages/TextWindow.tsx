import { useRef, useEffect} from 'react';
import MonacoEditor from '@monaco-editor/react';
import {Message} from '../api/Websocket.tsx';
import { useSocket } from '../context/SocketProvider.tsx';
import { useCode } from '../context/CodeProvider.tsx';
import { useRemoteUpdate } from '../context/RemoteUpdateProvider.tsx';

const TextWindow = () => {
    
    const {code} = useCode();
    const editorRef = useRef<any>(null);
    const socketRef = useSocket();
    const remoteUpdateRef = useRemoteUpdate();

    useEffect(()=>{
        syncMessage();
        // eslint-disable-next-line
    },[])
    // Add Message to array and process , to not overwhelm ws when given multiple inputs(fast typing)
    const sendMessage = (message: Message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message));
        console.log("Sent Message:", message);
        console.log(code);
       } else {
       console.warn("WebSocket is not open.");
       }
    };

    const syncMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({action: "sync"}));
        console.log("Sent Message");
       } else {
       console.warn("WebSocket is not open.");
       }
    }

    const handleEditor = (editor: any) => {
    editor.onDidChangeModelContent((event)=>{

        if(remoteUpdateRef.current){
            remoteUpdateRef.current = false;
            return;
        }

        event.changes.forEach((change)=>{
            const {rangeOffset, rangeLength, text} = change;
            if(text && rangeLength === 0){
                sendMessage({ action: "insert", text, position: rangeOffset, length: 0 });
            }else if(!text && rangeLength > 0){
                sendMessage({ action: "delete", text: "", position: rangeOffset, length: rangeLength });
            }else if(text && rangeLength > 0){
                sendMessage({ action: "replace", text, position: rangeOffset, length: rangeLength });
            }
            else{
                 console.warn("Unknown change:", change);
            }
            })
        });
    };

    const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor; // Store the editor instance
    console.log("Editor mounted:", editor);
    handleEditor(editor);
}
    return(
            <div className="h-screen">
                <MonacoEditor
                    height="100%"
                    width="100%" 
                    language="javascript" 
                    theme="vs-dark" 
                    value={code}
                    defaultValue={code}
                    onMount={handleEditorMount} 
                    options={{
                        fontSize: 18,
                        lineHeight: 24,
                        selectOnLineNumbers: true,
                        renderLineHighlight: 'all',
                        automaticLayout: true,
                    }}
                />
            </div>
    )
};

export default TextWindow;