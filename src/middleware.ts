import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard']
// Define auth routes that should not be accessed when logged in
const authRoutes = ['/login', '/register', '/verify']

export function middleware(request: NextRequest) {
    // Get token from cookies
    const token = request.cookies.get('accessToken')?.value
    const { pathname } = request.nextUrl

    // Debug logging
    console.log('Current path:', pathname)
    console.log('Token exists:', !!token)

    // Handle protected routes - redirect to login if no token
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!token) {
            console.log('No token found, redirecting to login')
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Handle auth routes - redirect to dashboard if token exists
    if (authRoutes.some(route => pathname.startsWith(route))) {
        if (token) {
            console.log('Token found, redirecting to dashboard')
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all protected and auth routes
         */
        '/dashboard/:path*',
        '/login',
        '/register',
        '/verify/:path*',
        '/'
    ]
}