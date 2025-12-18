import { Card } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/register-form"

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
    </Card>
  )
}
