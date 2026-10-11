import { LoginForm } from '@/components/loginForm'
import { Logo } from '@/components/logo'

const LoginPage = () => {
  return (
    <main className="app-main app-main--centered">
      <div className="login-page">
        <div className="login-page__heading">
          <Logo className="logo logo--lg" />
          <h1 className="login-page__title">Sign in to Cashly</h1>
          <p className="login-page__subtitle">View your account and recent transactions.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
export default LoginPage
