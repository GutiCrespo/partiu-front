'use client'

import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface InputProps extends React.ComponentProps<"input"> {
  labelText?: string;
  isSearchBox?: boolean;
}

function Input({ className, type, labelText, isSearchBox = false, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordType = type === "password"

  function togglePassword() {
    setShowPassword(!showPassword)
  }

  const baseInputClasses = cn(
    "w-full bg-transparent focus:outline-none placeholder:text-gray text-base",
    isPasswordType && "pr-10",
    isSearchBox && "pl-10",
    className
  )

  return (
    <div className={cn("flex flex-col", "selection:bg-light-gray selection:text-black flex h-fit w-full min-w-0 rounded-md border border-input  bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className)}>
      
      {labelText && (<Label className="mb-1 text-xs" htmlFor={props.id || props.name}>{labelText}</Label>)}
      
      <div className={cn("relative w-full")}>
        
        {isSearchBox && (
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.6 3.6a7.5 7.5 0 0013.05 13.05z" />
            </svg>
          </div>
        )}
        <input type={isPasswordType ? (showPassword ? "text" : "password") : type} className={baseInputClasses} 
          placeholder={isSearchBox ? "Para onde você quer ir?" : props.placeholder} 
            {...props}/>
        {isPasswordType && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export { Input }
