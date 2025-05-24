import React from "react";
import {isMessage} from '../errorHandling/Typeguard.tsx'
import { isSessionInfo } from "../errorHandling/Typeguard.tsx";

export interface Message {
    action: string;   
    text: string;     
    position: number; 
    length: number;  
  }

const handleMessage = (message: Message, setCode: React.Dispatch<React.SetStateAction<string>>, remoteUpdateRef: React.RefObject<boolean | null>) => {
  const { action, text, position, length } = message;

  remoteUpdateRef.current = true;

  setCode(prevCode => {
    switch (action) {
      case 'insert':
        return prevCode.slice(0, position) + text + prevCode.slice(position);
      case 'delete':
        return prevCode.slice(0, position) + prevCode.slice(position + length);
      case 'replace':
        return prevCode.slice(0, position) + text + prevCode.slice(position + length);
      case 'sync':
        return text; // assume full sync of code content
      default:
        console.warn('Unknown action type:', action);
        return prevCode;
    }
  });
};

export const InitWebSocket = (sessionID: string, socketRef: React.RefObject<WebSocket | null>, setCode: React.Dispatch<React.SetStateAction<string>>,remoteUpdateRef: React.RefObject<boolean | null>, navigate: (to: string) => void ) => {
    socketRef.current = new WebSocket(`ws://localhost:8080/ws?session=${sessionID}`);

    

    socketRef.current.onopen = () => {
        console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if(isSessionInfo(data)){
                console.log(data.sessionID)
                navigate(`/session/${data.sessionID}`)
            }else if(isMessage(data)) {
                handleMessage(data, setCode, remoteUpdateRef)
                console.log("Message Received:", data);
            }else {
                console.warn("Unknown message format:", data);
            }
        }catch(err){
            console.error("Error Parsing Message:", err)
        }
    };
    
    socketRef.current.onclose = () => {
        console.log("Websocket Closed");
        socketRef.current = null;
    };

    socketRef.current.onerror = (error) => {
        console.log("Websocket error:", error);
    }
}