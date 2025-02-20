import { useRef } from "react";
import HoverGlow from "@/components/HoverGlow";
import ParticleBackground from "@/components/ParticleBackground";
// import ContactForm from "@/components/ContactForm";

export default function Home() {
  const titleRef = useRef(null);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 lg:p-24 overflow-hidden">
      {/* Background Animation Layer */}
      <ParticleBackground />
      <HoverGlow titleRef={titleRef} />

      {/* Content */}
      <div className="relative z-20 text-center">
        <h1 ref={titleRef} className="text-[120px] font-bold text-white relative mix-blend-lighten">
          Hören
        </h1>
        <p className="text-2xl text-white-300 mb-6">
          Join our community and stay connected to the music scene.
        </p>

        {/* Contact Form */}
        {/* <ContactForm /> */}
      </div>
    </main>
  );
}
