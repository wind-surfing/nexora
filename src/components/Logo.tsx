import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Logo() {
  return (
    <Link href="/" className='cursor-pointer'>
      <Image src="/nexora.svg" alt="Nexora" width={75} height={75} />
    </Link>
  )
}

export default Logo