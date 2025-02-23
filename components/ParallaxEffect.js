import { useEffect, useRef } from "react";

const ParallaxEffect = () => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    function handleMouseMove(e) {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 30;
      const moveY = (e.clientY / window.innerHeight - 0.5) * 30;

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={parallaxRef}
      className="fixed top-0 left-0 w-full h-full bg-black z-0 will-change-transform"
    />
  );
};

export default ParallaxEffect;
