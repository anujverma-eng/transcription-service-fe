// src/pages/Dashboard.tsx
import React from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logoutUser } from '@/features/auth/authSlice'

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div className="p-4">
      <h1>Dashboard</h1>
      <p>Hello, {auth.user?.name || auth.user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
