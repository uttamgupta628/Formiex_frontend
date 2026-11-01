import EverydayWear from '../Compontents/EverydayWear'
import Questions from '../Compontents/Questions'
import ProductFeature from '../Compontents/ProductFeature'
import BestSellers from '../Compontents/BestSeller'
import HowToUse from '../Compontents/HowToUse'
import PerfectMatch from '../Compontents/PerfectMatch'
import HeroSection from '../Compontents/HeroSection'

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        <HeroSection />
        <EverydayWear/>
        <ProductFeature/>
        <BestSellers/>
        <PerfectMatch/>
        <HowToUse/>
        <Questions/>
      </main>
    </div>
  )
}

export default Home