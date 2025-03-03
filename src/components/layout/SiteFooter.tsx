// src/components/layout/SiteFooter.tsx
import React from "react"
import { Link } from "react-router-dom"

export default function SiteFooter() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        <div className="text-gray-600 dark:text-gray-300 text-sm">
          © 2025 TranscriptionSaaS, Inc. All rights reserved.
        </div>
        <div className="flex flex-col md:flex-row items-center md:space-x-4 mt-2 md:mt-0">
          <Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2 md:mb-0">
            Terms
          </Link>
          <Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2 md:mb-0">
            Privacy
          </Link>
          <Link to="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
