let experienceStarted = false;
let animationReady = false;
let animationHasRun = false;

// Import the data to customize and insert them into page
const fetchData = () => {
  fetch("customize.json")
    .then(data => data.json())
    .then(data => {
      dataArr = Object.keys(data);
      dataArr.map(customData => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .querySelector(`[data-node-name*="${customData}"]`)
              .setAttribute("src", data[customData]);
          } else {
            document.querySelector(`[data-node-name*="${customData}"]`).innerText = data[customData];
          }
        }

        // Check if the iteration is over
        // Run amimation if so
        if ( dataArr.length === dataArr.indexOf(customData) + 1 ) {
          animationReady = true;
          maybeStartAnimation();
        } 
      });
    });
};

// Block non-desktop screens with an overlay
const ensureDesktopAccess = () => {
  const blocker = document.getElementById("desktop-blocker");
  const container = document.querySelector(".container");
  if (!blocker || !container) return;

  const isMobileUA = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isDesktopWidth = window.innerWidth >= 900;
  const allowAccess = isDesktopWidth && !isMobileUA;

  if (allowAccess) {
    blocker.classList.remove("show");
    container.removeAttribute("aria-hidden");
  } else {
    blocker.classList.add("show");
    container.setAttribute("aria-hidden", "true");
  }
};

let musicInitialized = false;

// Background music autoplay with toggle control
const initMusicPlayer = () => {
  if (musicInitialized) return;
  const audio = document.getElementById("birthday-audio");
  const toggleBtn = document.getElementById("music-toggle");
  if (!audio || !toggleBtn) return;
  musicInitialized = true;

  const iconEl = toggleBtn.querySelector(".music-control__icon");
  const labelEl = toggleBtn.querySelector(".music-control__label");

  const updateToggleState = () => {
    const playing = !audio.paused && !audio.muted;
    toggleBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    if (labelEl) labelEl.textContent = playing ? "Mute" : "Play";
    if (iconEl) iconEl.textContent = playing ? "🔊" : "🔈";
  };

  const resumeOnInteraction = () => {
    audio.muted = false;
    audio
      .play()
      .then(updateToggleState)
      .catch(() => {
        audio.muted = true;
        updateToggleState();
      });
    ["click", "touchstart", "keydown"].forEach(evt =>
      document.removeEventListener(evt, resumeOnInteraction)
    );
  };

  const attemptAutoPlay = () => {
    audio.volume = 0.6;
    audio.muted = false;
    audio
      .play()
      .then(updateToggleState)
      .catch(() => {
        // Autoplay blocked, wait for user interaction
        audio.muted = true;
        updateToggleState();
        ["click", "touchstart", "keydown"].forEach(evt =>
          document.addEventListener(evt, resumeOnInteraction, { once: true })
        );
      });
  };

  toggleBtn.addEventListener("click", () => {
    if (audio.muted || audio.paused) {
      audio.muted = false;
      audio
        .play()
        .then(updateToggleState)
        .catch(() => {
          audio.muted = true;
          updateToggleState();
        });
    } else {
      audio.muted = true;
      audio.pause();
      updateToggleState();
    }
  });

  updateToggleState();
  attemptAutoPlay();
};

const maybeStartAnimation = () => {
  if (experienceStarted && animationReady && !animationHasRun) {
    animationHasRun = true;
    animationTimeline();
  }
};

const startExperience = () => {
  if (experienceStarted) return;
  experienceStarted = true;

  const overlay = document.getElementById("start-overlay");
  if (overlay) {
    overlay.classList.remove("show");
  }

  document.removeEventListener("keydown", handleStartKey);
  maybeStartAnimation();
};

const handleStartKey = event => {
  const isSpace =
    event.code === "Space" ||
    event.key === " " ||
    event.keyCode === 32;

  if (isSpace) {
    event.preventDefault();
    startExperience();
  }
};

const initStartOverlay = () => {
  const overlay = document.getElementById("start-overlay");
  if (!overlay) {
    experienceStarted = true;
    maybeStartAnimation();
    return;
  }

  overlay.classList.add("show");
  document.addEventListener("keydown", handleStartKey);
};

// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg"
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg"
  };

  const tl = new TimelineMax();

  tl
    .to(".container", 0.1, {
      visibility: "visible"
    })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10
    })
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "-=1"
    )
    .from(".three", 0.7, {
      opacity: 0,
      y: 10
      // scale: 0.7
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2"
    )
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0
    })
    .staggerTo(
      ".hbd-chatbox span",
      0.5,
      {
        visibility: "visible"
      },
      0.05
    )
    .to(".fake-btn", 0.1, {
      backgroundColor: "rgb(127, 206, 248)"
    })
    .to(
      ".four",
      0.5,
      {
        scale: 0.2,
        opacity: 0,
        y: -150
      },
      "+=0.7"
    )
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff"
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0
      },
      "+=0.5"
    )
    .to(
      ".idea-5 .smiley",
      0.7,
      {
        rotation: 90,
        x: 8
      },
      "+=0.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0
      },
      "+=2"
    )
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut
      },
      0.2,
      "+=1"
    )
    .staggerFromTo(
      ".baloons img",
      2.5,
      {
        opacity: 0.9,
        y: 1400
      },
      {
        opacity: 1,
        y: -1000
      },
      0.2
    )
    .from(
      ".debby-dp",
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45
      },
      "-=2"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5)
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg"
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1"
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90
      },
      "+=1"
    );

  // tl.seek("currentStep");
  // tl.timeScale(2);

  // Restart Animation on click
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
  });
};

// Run fetch and animation in sequence
fetchData();
document.addEventListener("DOMContentLoaded", initMusicPlayer);
document.addEventListener("DOMContentLoaded", initStartOverlay);
window.addEventListener("load", ensureDesktopAccess);
window.addEventListener("resize", ensureDesktopAccess);
window.addEventListener("load", initMusicPlayer);