'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from './components/Dashboard'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token){
      router.push('/auth')
      return
    }
    async function validateToken(){
      try {
        const response = await fetch("http://127.0.0.1:8000/validate_token", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          localStorage.removeItem("accessToken");
          router.push("/auth"); // Redirect if token is invalid
        }
      } catch (error) {
        console.error("Error validating token:", error);
        router.push("/auth");
      }};
      validateToken();
    }, [])
  return <Dashboard />
}

