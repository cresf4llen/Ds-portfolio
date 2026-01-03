import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Experience from "@/components/experience"
import Partners from "@/components/partners"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import SmoothScroll from "@/components/smooth-scroll"
import CustomCursor from "@/components/cursor"

export default function Home() {
  return (
    <SmoothScroll>
      <main className="bg-background min-h-screen overflow-x-hidden">
        <CustomCursor />
        <Navigation />
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Partners />
        <Contact />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
