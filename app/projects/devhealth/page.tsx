import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function DevHealthPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-24">
        <Link 
          href="/#projects" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">DevHealth</h1>
          <p className="text-xl text-muted-foreground">AI Wellness Platform</p>
        </div>

        <div className="relative aspect-video w-full mb-12 overflow-hidden rounded-lg">
          <Image
            src="/images/devhealth-website.webp"
            alt="DevHealth"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            DevHealth is a full-stack wellness platform designed to help developers guard 
            against burnout. It features AI-powered focus sessions and recovery reminders, 
            with real-time analytics tracking over 48,000+ focus sessions and burnout 
            prevention alerts to keep developers healthy and productive.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Year</h3>
              <p className="text-lg">2025</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Type</h3>
              <p className="text-lg">Web App & Extension</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Link</h3>
              <a 
                href="https://www.devhealth.online" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg text-accent hover:underline"
              >
                Visit Website →
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
