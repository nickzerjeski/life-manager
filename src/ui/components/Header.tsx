import { Dispatch, SetStateAction } from 'react'

interface Props {
  onMenu: () => void
}

export default function Header({ onMenu }: Props) {
  return (
    <header className="bg-blue-600 text-white flex items-center p-4">
      <button
        className="md:hidden mr-2"
        onClick={onMenu}
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <h1 className="text-xl font-bold">LifeManager</h1>
    </header>
  )
}
