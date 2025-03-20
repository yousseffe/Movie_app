import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Film, Monitor, Star, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="text-xl font-bold">V</span>
            </div>
            <span className="text-xl font-bold">Vidoe</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden md:flex md:gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
            <Button className="md:hidden" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[70vh] w-full overflow-hidden">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
          <div className="container relative z-10 flex h-full flex-col justify-center">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Your Ultimate Movie Experience
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Discover, watch, and manage your favorite movies all in one place. Join our community of movie
                enthusiasts today.
              </p>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/movies">Browse Movies</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need for Movies</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform offers a comprehensive set of features for movie lovers
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Film className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Extensive Library</h3>
              <p className="mt-2 text-muted-foreground">
                Access thousands of movies from various genres, languages, and formats.
              </p>
            </div>
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Personalized Recommendations</h3>
              <p className="mt-2 text-muted-foreground">
                Get movie suggestions based on your preferences and viewing history.
              </p>
            </div>
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Monitor className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Multi-device Access</h3>
              <p className="mt-2 text-muted-foreground">Watch your favorite movies on any device, anytime, anywhere.</p>
            </div>
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Community</h3>
              <p className="mt-2 text-muted-foreground">
                Join discussions, share reviews, and connect with other movie enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-lg bg-primary p-8 text-primary-foreground md:p-12">
            <div className="grid gap-6 md:grid-cols-2 md:gap-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Ready to Start Your Movie Journey?</h2>
                <p className="mt-4 text-lg text-primary-foreground/90">
                  Sign up today and get access to our extensive movie library, personalized recommendations, and more.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 md:items-end md:justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">Sign Up Now</Link>
                </Button>
                <p className="text-sm text-primary-foreground/80">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center">
                <div className="relative h-10 w-10 mr-2 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="text-xl font-bold">V</span>
                </div>
                <span className="text-xl font-bold">Vidoe</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Your ultimate destination for movies and entertainment.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/movies" className="text-muted-foreground hover:text-foreground">
                    Movies
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-muted-foreground hover:text-foreground">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-muted-foreground hover:text-foreground">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">Email: info@vidoe.com</li>
                <li className="text-muted-foreground">Phone: +1 (123) 456-7890</li>
                <li className="text-muted-foreground">Address: 123 Movie St, Hollywood, CA</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Vidoe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

