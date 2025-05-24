import React , { useEffect, useRef,  } from 'react'
import { XIcon } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null) // Learn More

  //UseEffect Function is called whenever there is change in given parametre(isOpen, onClose)
  //UseEffect Cleanup Fn (Return Fn) is used when comaponent is removed or when there is change in parametre , first cleanup fn is run and then effect is rerun 
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
  if(isOpen){
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
  }
  return () => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = 'unset'
  }
  }, [isOpen, onClose])

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />
        <div
          ref={modalRef}
          className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <XIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}