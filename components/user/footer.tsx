import Link from "next/link"

export function UserFooter() {
  return (
    <footer className="border-t bg-sidebar text-sidebar-foreground">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-10 mr-2 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="text-xl font-bold">V</span>
              </div>
              <span className="text-xl font-bold">Vidoe</span>
            </Link>
            <p className="mt-4 text-sm text-sidebar-muted-foreground">
              Your ultimate destination for movies and entertainment.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/people" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                  People
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-sidebar-muted-foreground">Email: info@vidoe.com</li>
              <li className="text-sidebar-muted-foreground">Phone: +1 (123) 456-7890</li>
              <li className="text-sidebar-muted-foreground">Address: 123 Movie St, Hollywood, CA</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-sidebar-accent pt-8 text-center text-sm text-sidebar-muted-foreground">
          <p>© {new Date().getFullYear()} Vidoe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

