import Link from 'next/link'
import React from 'react'
import DesktopNavbar from './DesktopNavbar'
import MobileNavbar from './MobileNavbar'

function Navbar() {
  return (
    <nav className='sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50'>

      <div className='flex justify-between items-center max-w-7xl mx-auto px-4'>

        <div className='flex items-center justify-between h-16'>

          <Link href="/" className='text-xl font-bold text-primary font-mono tracking-wider'>
            Sociality
          </Link>

        </div>

        <DesktopNavbar />
        <MobileNavbar />

      </div>

    </nav>
  )
}

export default Navbar