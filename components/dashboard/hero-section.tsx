export function HeroSection() {
    return (
      <section className="relative h-[50vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-trading-office-with-a-big-screen-4677-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-yale-blue bg-opacity-60 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-yale-white mb-4">Welcome to QOINN</h1>
            <p className="text-xl md:text-2xl text-yale-white">Your AI-powered investment platform</p>
          </div>
        </div>
      </section>
    )
  }
  
  