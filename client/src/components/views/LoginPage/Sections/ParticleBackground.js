import Particles from "react-tsparticles";

function ParticleBackground() {
  return (
    <div>
      <Particles
        options={{
          background: {
            color: {
              value: "#eeeeee",
            },
          },
          fullScreen: {
            enable: true,
            zIndex: -1,
          },
          fpsLimit: 60,
          interactivity: {
            detectsOn: "canvas",
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
                speed: 1,
              },
            },
          },
          particles: {
            color: {
              value: "#000000",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: false,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outMode: "bounce",
              random: false,
              speed: 5,
              straight: false,
            },
            rotate: {
              animation: {
                enable: true,
                speed: 10,
                sync: false,
              },
            },
            number: {
              density: {
                enable: true,
                max: 1000,
                value_area: 700,
              },
              max: 150,
              limit: 50,
              value: 30,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              character: [
                {
                  fill: true,
                  font: "Hursheys",
                  value: ["♪", "♩", "♫", "♬"],
                  style: "",
                  weight: 80,
                },
              ],
              polygon: { nb_sides: 5 },
              stroke: { color: "random", width: 1 },
              type: "char",
            },
            size: {
              anim: {
                enable: true,
                minimumValue: 15,
                speed: 20,
                sync: false,
              },
              random: { minimumValue: 15, maximumValue: 25, enable: true },
              value: 20,
            },
          },
          detectRetina: true,
        }}
      />{" "}
    </div>
  );
}

export default ParticleBackground;
