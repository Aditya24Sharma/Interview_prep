import { User } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Interview Prep</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 text-xl">John Doe</span>
          <div className="bg-gray-200 rounded-full p-2">
            <User className="text-gray-600" size={24} />
          </div>
        </div>
      </div>
    </header>
  )
}

