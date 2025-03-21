// src/pages/GoogleCallbackPage.tsx
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { completeGoogleAuth } from '@/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function GoogleCallbackPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const auth = useAppSelector((state) => state.auth)

  useEffect(() => {
    // if user is already logged in => skip
    if (auth.user) {
      navigate('/dashboard', { replace: true })
      return
    }

    // call the thunk
    dispatch(completeGoogleAuth()).then((res: any) => {
      if (completeGoogleAuth.rejected.match(res)) {
        toast.error("Google Auth failed: " + res.payload)
        navigate("/auth")
      } else {
        toast.success("Logged in successfully!", { position: "bottom-right" })
        navigate("/dashboard")
      }
    })
  }, [auth.user, dispatch, navigate])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p>Completing Google authentication...</p>
    </div>
  )
}
