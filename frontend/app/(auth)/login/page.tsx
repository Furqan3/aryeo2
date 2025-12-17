import { Card } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import { SocialAuth } from "@/components/auth/social-auth"

export default function LoginPage() {
  return (
    <Card className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>

      <LoginForm />

      <div className="mt-6">
        <SocialAuth />
      </div>
    </Card>
  )
}
