import React from 'react'
import { ArrowRightIcon} from 'lucide-react'
import {InitWebSocket} from '../api/Websocket.tsx'
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketProvider.tsx';
import { useCode } from '../context/CodeProvider.tsx';
import { useRemoteUpdate } from '../context/RemoteUpdateProvider.tsx';

export interface ChildProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>; // Expecting the setter function
}

export const BlackButton = ({setIsModalOpen }:ChildProps)  => {
  console.log(typeof setIsModalOpen);
    return(
        <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-300 flex items-center justify-center"
              >
                Join Existing Session
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </button>
              
    );
}

export const BlueButton = () => {
  const navigate = useNavigate();
  const socketRef = useSocket();
  const {setCode} = useCode();
  const remoteUpdateRef = useRemoteUpdate();
  
  const handleConnection = () => {
    const id = "";
    InitWebSocket(id, socketRef, setCode, remoteUpdateRef, navigate);
  
  };

    return (
        <button
                onClick={()=>handleConnection()}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
              >
                Create New Session
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </button>
    )
}