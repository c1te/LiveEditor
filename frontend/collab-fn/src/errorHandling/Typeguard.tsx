import {Message} from '../api/Websocket.tsx';

export interface SessionInfo {
  sessionID: string;
}


export const isMessage = (data: any): data is Message => {
    return (
      typeof data === "object" &&
      typeof data.action === "string" &&
      typeof data.text === "string" &&
      typeof data.position === "number" &&
      typeof data.length === "number"
    );
  }


export const isSessionInfo = (data: any): data is SessionInfo => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.sessionID === "string"
  );
};