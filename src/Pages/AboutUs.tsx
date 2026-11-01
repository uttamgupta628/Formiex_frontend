
import AboutHero from '../Compontents/AboutHero'
import OurStory from '../Compontents/OurStory'
import Mission from '../Compontents/Mission'


function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <AboutHero/>
        <OurStory/>
        <Mission/>
      </main>
     
    </div>
  )
}

export default About