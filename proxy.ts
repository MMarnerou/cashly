import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

// Sends visitors without a valid session to /login, and keeps signed-in users off it.
export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const email = await verifySession(request.cookies.get(SESSION_COOKIE)?.value)
  const isLoginPage = pathname === '/login'

  if (!email && !isLoginPage) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Not signed in' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (email && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|icon$).*)'],
}
