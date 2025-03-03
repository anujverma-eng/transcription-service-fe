// src/components/PasswordInput.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes } from 'react'

export function PasswordInput({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}