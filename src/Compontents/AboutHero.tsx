// 👇 Background image ka outside link yahan paste karein
const BG_URL = 'https://res.cloudinary.com/dquki4xol/image/upload/v1793361171/WhatsApp_Image_2026-10-01_at_6.45.01_PM_easzea.jpg'

function AboutHero() {
  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @keyframes ah-zoom {
          from { transform: scale(1.15); }
          to   { transform: scale(1); }
        }
        @keyframes ah-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ah-drift {
          0%, 100% { transform: scale(1) translateX(0); }
          50%      { transform: scale(1.04) translateX(-1.5%); }
        }
        .ah-zoom  { animation: ah-zoom 2.2s ease-out both, ah-drift 20s ease-in-out 2.2s infinite; }
        .ah-fade  { animation: ah-fade 1.2s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .ah-zoom, .ah-fade { animation: none; }
        }
      `}</style>

      <section
        id="about-hero"
        className="ah-fade relative isolate h-[260px] w-full overflow-hidden bg-[#9ea2a2] sm:h-[380px] md:h-[460px] lg:h-[560px] xl:h-[620px]"
      >
        {/* ===== Background image ===== */}
        <div
          role="img"
          aria-label="About us banner"
          className="ah-zoom absolute inset-0 bg-cover bg-[70%_center] bg-no-repeat sm:bg-center"
          style={{ backgroundImage: `url(${BG_URL})` }}
        />

        {/* ===== Halka dark layer (screenshot jaisa) ===== */}
        <div className="absolute inset-0 bg-black/20" />
      </section>
    </>
  )
}

export default AboutHero