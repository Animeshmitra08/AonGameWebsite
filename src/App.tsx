import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import GamesSection from './components/GamesSection'
import AboutSection from './components/AboutSection'
import TeamSection from './components/TeamSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <GamesSection />
      <AboutSection />
      <TeamSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default App
