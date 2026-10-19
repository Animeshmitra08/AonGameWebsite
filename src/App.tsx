import { LazyMotion, MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import GamesSection from './components/GamesSection'
import AboutSection from './components/AboutSection'
import TeamSection from './components/TeamSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

const loadMotionFeatures = () => import('./motionFeatures').then((mod) => mod.default)

function App() {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen bg-dark text-white overflow-x-hidden">
          <Navbar />
          <HeroSection />
          <GamesSection />
          <AboutSection />
          <TeamSection />
          <ContactSection />
          <Footer />
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
