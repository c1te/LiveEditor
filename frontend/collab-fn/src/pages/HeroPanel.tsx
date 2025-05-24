import { useState} from 'react'
import { UsersIcon, ArrowRightIcon } from 'lucide-react'
import {BlueCard, BlackCard} from '../components/Cards.tsx'
import { InitWebSocket } from '../api/Websocket.tsx'
import {Modal} from '../components/Modal.tsx'
import { useSocket } from '../context/SocketProvider.tsx'
import { useNavigate } from 'react-router-dom'
import { useCode } from '../context/CodeProvider.tsx'
import { useRemoteUpdate } from '../context/RemoteUpdateProvider.tsx'

export default function HeroPanel(){
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const socketRef = useSocket();
    const {setCode} = useCode();
    const remoteUpdateRef = useRemoteUpdate();

    const handleConnection = (sessionCode: string) => {
        const id = sessionCode;
        InitWebSocket(id, socketRef, setCode, remoteUpdateRef, navigate);
      
      };
    

    return(
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-16">         
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full  mb-16">
                        <UsersIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6x">Collaborate <span className="text-blue-600">instantly</span></h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">Create or join interactive sessions with your team, no account required. Start collaborating in seconds.</p>                 
                </div>   
                <div className='max-w-3xl mx-auto'>
                    <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
                        <div className="p-8 md:p-10">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <BlueCard/>
                                <BlackCard setIsModalOpen={setIsModalOpen} />
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Join Existing Session"
      >
        <form className="space-y-4" 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem("sessionId") as HTMLInputElement;
                const sessionCode = input.value;
                handleConnection(sessionCode)
              }}
        >
          <div>
            <label
              htmlFor="sessionId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Session Code
            </label>
            <input
              id="sessionId"
              type="text"
              placeholder="Enter session code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
          >
            Join Session
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
        </form>
      </Modal>
        </div>
    );
}