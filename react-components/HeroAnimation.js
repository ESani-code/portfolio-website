// --- CORRECTED INTERACTIVE PROFILE IMAGE COMPONENT ---
const InteractiveProfileImage = () => {
  const { useEffect, useRef, useCallback, useMemo } = React;

  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  
  const animationHandlers = useMemo(() => {
    let rafId = null;

    const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
    const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
    const adjust = (value, fromMin, fromMax, toMin, toMax) => round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
    const easeInOutCubic = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    const updateCardTransform = (offsetX, offsetY, card, wrap) => {
      const { clientWidth: width, clientHeight: height } = card;
      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--rotate-x': `${round(-(centerY / 4))}deg`,
        '--rotate-y': `${round(centerX / 3)}deg`,
        
        // --- NEW PROPERTIES FOR THE GLOW EFFECT ---
        // Calculate the cursor's distance from the center (0 to 1)
        '--pointer-from-center': clamp(Math.hypot(centerY, centerX) / 50, 0, 1),
        // Adjust the background position for a parallax effect
        '--background-x': `${adjust(percentX, 0, 100, 40, 60)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 40, 60)}%`
      };

      Object.entries(properties).forEach(([p, v]) => wrap.style.setProperty(p, v));
};

    const createSmoothAnimation = (duration, startX, startY, card, wrap) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;
      const animationLoop = currentTime => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);
        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);
        updateCardTransform(currentX, currentY, card, wrap);
        if (progress < 1) rafId = requestAnimationFrame(animationLoop);
      };
      rafId = requestAnimationFrame(animationLoop);
    };

    return { updateCardTransform, createSmoothAnimation, cancelAnimation: () => cancelAnimationFrame(rafId) };
  }, []);

  // Effect to add event listeners AND INITIALIZE THE CARD
  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    const mobileTiltSensitivity = 4; // Control sensitivity here
    if (!card || !wrap) return;

    // --- MOUSE/POINTER EVENTS ---
    const handlePointerMove = e => {
      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(e.clientX - rect.left, e.clientY - rect.top, card, wrap);
    };
    const handlePointerEnter = () => {
      animationHandlers.cancelAnimation();
      wrap.classList.add('active');
      card.classList.add('active');
    };
    const handlePointerLeave = e => {
      animationHandlers.createSmoothAnimation(600, e.offsetX, e.offsetY, card, wrap);
      wrap.classList.remove('active');
      card.classList.remove('active');
    };

    // --- MOBILE TILT EVENT HANDLER ---
    const handleDeviceOrientation = e => {
      const { beta, gamma } = e;
      if (beta == null || gamma == null) return;
      const newX = (card.clientWidth / 2) + (gamma * mobileTiltSensitivity);
      const newY = (card.clientHeight / 2) + (beta * mobileTiltSensitivity) - 20;
      animationHandlers.updateCardTransform(newX, newY, card, wrap);
    };

    // --- PERMISSION REQUEST FOR iOS ---
    const handleClickForPermission = () => {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(state => {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        }).catch(console.error);
        card.removeEventListener('click', handleClickForPermission);
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };

    // --- ADDING EVENT LISTENERS ---
    card.addEventListener('pointerenter', handlePointerEnter);
    card.addEventListener('pointermove', handlePointerMove);
    card.addEventListener('pointerleave', handlePointerLeave);
    card.addEventListener('click', handleClickForPermission);

    // Initialize the card
    const initializeCard = () => {
      const initialX = wrap.clientWidth / 2;
      const initialY = wrap.clientHeight / 2;
      animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    };
    initializeCard();

    // --- CLEANUP FUNCTION ---
    return () => {
      card.removeEventListener('pointerenter', handlePointerEnter);
      card.removeEventListener('pointermove', handlePointerMove);
      card.removeEventListener('pointerleave', handlePointerLeave);
      card.removeEventListener('click', handleClickForPermission);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      animationHandlers.cancelAnimation();
    };
  }, [animationHandlers]);

  // The JSX remains the same
  return (
    <div ref={wrapRef} className="pc-card-wrapper">
      <div ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          <img
            className="avatar"
            src="images/me-pic.JPG"
            alt="A photo of Sani Eneojo Emmanuel"
          />
        </div>
      </div>
    </div>
  );
};
// --- Your existing ClickSpark component code should be below this ---


// --- NEW CANVAS-BASED CLICK SPARK COMPONENT ---
const ClickSpark = () => {
  // Since we don't have 'import', we access React hooks via the global React object
  const canvasRef = React.useRef(null);
  const sparksRef = React.useRef([]);

  // --- Component Properties (customize here) ---
  const sparkColor = '#ed3838'; // Matches your site's --accent-color
  const sparkSize = 10;
  const sparkRadius = 50;
  const sparkCount = 12;
  const duration = 800;
  const easing = 'ease-out';

  // The easing function for the animation
  const easeFunc = React.useCallback(t => t * (2 - t), [easing]);

  // Main animation loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [sparkColor, sparkSize, sparkRadius, duration, easeFunc]);

  // Sets up canvas size and global click listener
  React.useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleClick = e => {
      const now = performance.now();
      const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
        x: e.clientX,
        y: e.clientY,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));
      sparksRef.current.push(...newSparks);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('click', handleClick);
    };
  }, [sparkCount]);


  return React.createElement('canvas', {
    ref: canvasRef,
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999,
    },
  });
};


// --- (UNCHANGED) Your existing hero text animation component ---
const TxtRotate = ({ text = "Hi, I'm Sani Eneojo Emmanuel" }) => {
  const words = text.split(" ");
  return (
    <h1 className="hero-heading">
      {words.map((word, i) => (
        <span key={i} className="word" style={{ animationDelay: `${i * 180}ms` }}>
          {word}
        </span>
      ))}
    </h1>
  );
};

// --- RENDER LOGIC ---
// We now render our components into TWO DIFFERENT parts of the page.

// 1. Render the TxtRotate component into the hero section
const heroTextContainer = document.querySelector('#react-hero-text');
const heroTextRoot = ReactDOM.createRoot(heroTextContainer);
heroTextRoot.render(<TxtRotate />);

// 2. Render the ClickSpark canvas component into its dedicated container
const sparkCanvasContainer = document.querySelector('#spark-canvas-container');
const sparkCanvasRoot = ReactDOM.createRoot(sparkCanvasContainer);
sparkCanvasRoot.render(<ClickSpark />);


// 3. Render the InteractiveProfileImage into the about-me section
const profileCardContainer = document.querySelector('#react-profile-card-container');
// Ensure the container exists before trying to render to it
if (profileCardContainer) {
    const profileCardRoot = ReactDOM.createRoot(profileCardContainer);
    profileCardRoot.render(<InteractiveProfileImage />);
}
