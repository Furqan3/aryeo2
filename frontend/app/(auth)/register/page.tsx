import { Card } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/register-form"
import { SocialAuth } from "@/components/auth/social-auth"

export default function RegisterPage() {
  return (
    <Card className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="text-muted-foreground">
          Get started with RealtyPost today
        </p>
      </div>

      <RegisterForm />

      <div className="mt-6">
        <SocialAuth />
      </div>
    </Card>
  )
}
