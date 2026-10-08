import Image from 'next/image'
import Link from 'next/link'
import logo from '../../app/assests/img/logo/mediflow-1.png'


interface logoProps {
      className ?: string
       imageClassName?: string
}

export default function Logo({className, imageClassName}:logoProps) {
    return (
        <Link
            href="/"
            className={className}
        >
            <Image src={logo} alt='MediFlow' className={imageClassName} />
        </Link>
    )
}
