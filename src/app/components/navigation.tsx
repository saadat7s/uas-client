"use client"

import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAppSelector } from "@/lib/hooks"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.user)

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-pakistan-600 to-pakistan-700 rounded-lg group-hover:from-pakistan-700 group-hover:to-pakistan-800 transition-all duration-300">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pakistan-700 to-pakistan-600 bg-clip-text text-transparent">
                UCAS Pakistan
              </span>
              <div className="text-xs text-gray-500 -mt-1">University Application System</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/universities"
              className="text-gray-700 hover:text-pakistan-600 transition-colors font-medium relative group"
            >
              Universities
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pakistan-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/courses"
              className="text-gray-700 hover:text-pakistan-600 transition-colors font-medium relative group"
            >
              Courses
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pakistan-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/apply"
              className="text-gray-700 hover:text-pakistan-600 transition-colors font-medium relative group"
            >
              Apply
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pakistan-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/track"
              className="text-gray-700 hover:text-pakistan-600 transition-colors font-medium relative group"
            >
              Track
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pakistan-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="border-pakistan-300 text-pakistan-700 hover:bg-pakistan-50 bg-transparent"
                >
                  Dashboard
                </Button>
                <Button className="bg-gradient-to-r from-pakistan-600 to-pakistan-700 hover:from-pakistan-700 hover:to-pakistan-800 text-white shadow-lg">
                  Profile
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  asChild
                  className="border-pakistan-300 text-pakistan-700 hover:bg-pakistan-50 bg-transparent"
                >
                  <Link href="/register">Register</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-pakistan-600 to-pakistan-700 hover:from-pakistan-700 hover:to-pakistan-800 text-white shadow-lg"
                >
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-pakistan-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-fade-in">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link
                href="/universities"
                className="text-gray-700 hover:text-pakistan-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Universities
              </Link>
              <Link
                href="/courses"
                className="text-gray-700 hover:text-pakistan-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/apply"
                className="text-gray-700 hover:text-pakistan-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Apply
              </Link>
              <Link
                href="/track"
                className="text-gray-700 hover:text-pakistan-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Track
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  asChild
                  className="border-pakistan-300 text-pakistan-700 hover:bg-pakistan-50 bg-transparent"
                >
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-pakistan-600 to-pakistan-700 hover:from-pakistan-700 hover:to-pakistan-800 text-white"
                >
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
