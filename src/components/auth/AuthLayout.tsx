import Logo from '@/assets/logo'
import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='mb-4'>
        <Logo className="h-12 w-12" />
      </div>
      {children}
    </div>
  )
}
