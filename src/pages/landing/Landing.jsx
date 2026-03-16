import './Landing.css'
import Navbar from '../../components/landing/Navbar'
import Hero from '../../components/landing/Hero'
import Features from '../../components/landing/Features'
import HowItWorks from '../../components/landing/HowItWorks'
import SocialProof from '../../components/landing/SocialProof'
import CTA from '../../components/landing/CTA'
import Footer from '../../components/landing/Footer'

const Landing = () => {
  return (
    <>
        <Navbar />
        <Hero />
        <Features/>
        <HowItWorks/>
        <SocialProof/>
        <CTA/>
        <Footer/>
    </>
  )
}

export default Landing