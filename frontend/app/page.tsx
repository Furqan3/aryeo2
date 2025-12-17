import { auth } from "@/lib/auth/config"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Zap, Shield } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/dashboard/user-nav"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-sidebar/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">RealtyPost</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session?.user ? (
              <UserNav />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Real Estate Content</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Create Stunning Real Estate{" "}
            <span className="text-primary">Social Media Posts</span> in Minutes
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your property listings into eye-catching social media content. Simply import from Aryeo and let our AI-powered editor do the rest.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={session?.user ? "/dashboard" : "/register"}>
              <Button size="lg" className="text-lg px-8">
                {session?.user ? "Go to Dashboard" : "Start Creating Free"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            {!session?.user && (
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Import listings from Aryeo and create stunning posts in minutes, not hours.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Design</h3>
            <p className="text-muted-foreground">
              Beautiful templates and smart editing tools that make you look like a pro designer.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Projects, Secure</h3>
            <p className="text-muted-foreground">
              All your projects are saved securely in the cloud and accessible from anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
