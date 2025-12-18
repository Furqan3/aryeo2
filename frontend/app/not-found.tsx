'use client' // Required for client-side redirect

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/') // replace avoids adding 404 to history
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Page Not Found</h1>
      <p>Redirecting you to the home page...</p>
    </div>
  )
}