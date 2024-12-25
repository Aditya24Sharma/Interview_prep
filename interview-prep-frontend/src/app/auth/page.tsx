'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { User, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUserName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const {setUsername} = useUser();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()

    console.log(isLogin ? 'Logging in...' : 'Signing up...', { email, password, username })

    if (isLogin){
      const loginData = new URLSearchParams({
        username: username,
        password: password,
      });
      try{
        const response = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: loginData.toString(),
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Login failed:", errorData.detail);
          setError(errorData.detail)
          return;
        }
        const data = await response.json();
        console.log("Login successful!", data);
    
        // Save the token for later use
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("username", data.username);
        // console.log('Store Username', data.username);
        setUsername(data.username)
      } catch (error) {
        console.error("Error during login:", error);
        setError("Something went wrong. Please try again later.")
      }
    }
    else {
      const signupData = {
        'username': username,
        'email': email,
        'password': password,
      }
      try{
        const response = await fetch("http://127.0.0.1:8000/signup",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        })
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Signup failed:", errorData);
          return;
        }
        const data = await response.json();
        console.log("Signup successful!", data.message);
      }catch(error){
        console.error("Error during signup:", error);
      }
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full md:max-w-full">
        <h1 className="text-7xl font-extrabold text-center text-blue-800 mb-6">Interview Prep</h1>
        <h2 className="mt-9 text-center text-4xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 shadow-lg shadow-gray-400 sm:rounded-xl sm:px-10 ">
        {error && (
            <div className="mb-4 bg-red-100 border-red-400 p-3 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-2">
                  <p className="text-lg text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
                <label htmlFor="username" className="block text-2xl font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-xl border-gray-300 rounded-md"
                    placeholder="JohnDoe123"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </div>
            {!isLogin && (
              <div>
              <label htmlFor="email" className="block text-2xl font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-xl border-gray-300 rounded-lg"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            )}
            {/* ------------------ */}
            <div>
              <label htmlFor="password" className="block text-2xl font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-xl border-gray-300 rounded-lg"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-1 px-4 border border-transparent rounded-lg shadow-sm text-xl font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 text-lg">
                  {isLogin ? 'New to our platform?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => (setIsLogin(!isLogin), setError(''), setUserName(''), setPassword(''))}
                className="w-full inline-flex justify-center py-1 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-xl font-medium text-gray-500 hover:bg-gray-50"
              >
                {isLogin ? 'Create an account' : 'Sign in to existing account'}
                <ArrowRight className="ml-2 h-7 w-5 text-gray-400" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

