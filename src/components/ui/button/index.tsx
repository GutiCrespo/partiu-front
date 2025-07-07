'use client'

import clsx from "clsx"
import { ReactNode } from "react"

type Variant = 'default' | 'secondary'

type Props = {
  children: ReactNode
  variant?: Variant
  type?: "button" | "submit" | "reset"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const variantStyles: Record<Variant, string> = {
  default: 'bg-dark-bg text-white hover:bg-hover-primary',
  secondary: 'bg-white text-black border border-gray rounded-lg hover:bg-gray-100',
}

export const Button = ({
  className,
  children,
  variant = "default",
  type = "button",
  ...rest
}: Props) => {
  return (
    <button
      type={type}
      className={clsx(
        'ButtonAnimation',
        'text-sm py-2 px-5 rounded-lg',
        'cursor-pointer inline-flex items-center justify-center w-fit',
        'transition-all duration-150 ease-in-out',
        'outline-none ring-dark-gray ring-offset-2 focus-visible:ring-2 active:scale-[0.98]',
        variantStyles[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
