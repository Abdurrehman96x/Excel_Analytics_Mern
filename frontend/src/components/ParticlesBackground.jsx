import { loadFull } from "tsparticles";
import { useCallback } from "react";
import Particles from "react-tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 -z-10"
      options={{
        fullScreen: false,
        background: {
          color: {
            value: "transparent",
          },
        },
        particles: {
          color: { value: "#ffffff" },
          links: { enable: true, color: "#ffffff", distance: 100 },
          move: { enable: true, speed: 1 },
          size: { value: 2 },
          opacity: { value: 0.5 },
          number: { value: 60 },
        },
      }}
    />
  );
};

export default ParticlesBackground;
