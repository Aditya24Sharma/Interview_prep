'use client'

import { useState, useRef, useEffect } from 'react'
import { User, LogOut } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '../context/UserContext'

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [localuser, setLocalUser] = useState<string|null>('')
  const {username} = useUser();

  useEffect(() => {
    setLocalUser(localStorage.getItem('username'))
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if(pathname === '/auth'){
    return null
  }

  const handleLogout = async() => {
    const token = localStorage.getItem('access_token');
    console.log('Logout token', token)
    const response = await fetch("http://127.0.0.1:8000/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (response.ok) {
      console.log("Logged out successfully");
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
    router.push('/auth')
    } else {
      console.error("Logout failed");
    }
  };


  return (
    <header className="bg-white shadow">
      <div className="mt-6 mb-4 container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-5xl font-bold text-blue-800">Interview Prep</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-4 focus:outline-none"
          >
            <span className="text-2xl text-gray-600">{username ? username : localuser }</span>
            <div className="bg-gray-200 rounded-full p-2">
              <User className="text-gray-600" size={32} />
            </div>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-xl text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="inline-block mr-2" size={32} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

