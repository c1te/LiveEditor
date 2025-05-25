import React from 'react'
import {PlusCircleIcon, UsersIcon } from 'lucide-react'
import {BlueButton, BlackButton} from './Buttons.tsx'


interface ChildProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>; // Expecting the setter function
}

export const BlueCard = () => {
    return (
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:border-blue-300 transition-colors duration-300">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <PlusCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Generate Session
              </h3>
              <p className="text-gray-600 mb-6">
                Create a new collaboration space and invite others to join.
              </p>
              <BlueButton/>
        </div>
    );
}

export const BlackCard = ({setIsModalOpen} : ChildProps)  => {
    return(
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-300">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <UsersIcon className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Join Session
              </h3>
              <p className="text-gray-600 mb-6">
                Enter a session code to join an existing collaboration.
              </p>
              <BlackButton setIsModalOpen = {setIsModalOpen}/>
        </div>
    );
}