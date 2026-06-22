const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');

        // Resize Canvas to fit window
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mouse Object to track coordinates
        const mouse = {
            x: null,
            y: null,
            radius: 150 // Connection/interaction radius for mouse
        };

        // Track mouse movement globally across the whole window
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });

        // Clear coordinates when mouse leaves the browser window
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Configuration
        const particleCount = calculateParticleCount();
        const particlesArray = [];

        function calculateParticleCount() {
            // Adjust density based on screen size
            return Math.floor((window.innerWidth * window.innerHeight) / 9000);
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Speed and direction
                this.vx = (Math.random() - 0.5) * 0.6; 
                this.vy = (Math.random() - 0.5) * 0.6;
                this.baseRadius = Math.random() * 2 + 1;
                this.radius = this.baseRadius;
            }

            // Draw individual particle
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                //ctx.fillStyle = 'rgba(0, 242, 254, 0.7)'; // Cyan theme color
                ctx.fillStyle = `rgba(0, 242, 254, ${this.opacity})`;
                ctx.fill();
            }

            // Update particle position and handle boundaries
            update() {
              // 1. Bounce off screen edges
              if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
              if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

              // 2. Move particle by its natural drift speed
              this.x += this.vx;
              this.y += this.vy;

              // Initialize opacity if it hasn't been set yet
              if (this.opacity === undefined) this.opacity = 0.7;

              // 3. Vortex Physics & Slow Disappear Radius
              if (mouse.x !== null && mouse.y !== null) {
                  let dx = mouse.x - this.x;
                  let dy = mouse.y - this.y;
                  let distance = Math.sqrt(dx * dx + dy * dy);

                  const maxInfluenceRadius = 350; // Increased radius for a more gradual approach
                  const disappearRadius = 40;     // Smaller absolute zero core so they travel further

                  if (distance < maxInfluenceRadius) {
                      if (distance < disappearRadius) {
                          // --- ZONE 1: CORE VANISH & RESPAWN ---
                          // Reset position to a random edge once they fully disappear
                          if (Math.random() > 0.5) {
                              this.x = Math.random() > 0.5 ? 0 : canvas.width;
                              this.y = Math.random() * canvas.height;
                          } else {
                              this.x = Math.random() * canvas.width;
                              this.y = Math.random() > 0.5 ? 0 : canvas.height;
                          }
                          this.vx = (Math.random() - 0.5) * 0.6;
                          this.vy = (Math.random() - 0.5) * 0.6;
                          this.opacity = 0.7;
                          this.radius = this.baseRadius;

                      } else {
                          // --- ZONE 2: GENTLE ORBIT & GRADUAL FADE ---
                          // 'force' represents progress from outer edge (0) to inner core (1)
                          let force = (maxInfluenceRadius - distance) / (maxInfluenceRadius - disappearRadius);
                          
                          let dirX = dx / distance;
                          let dirY = dy / distance;

                          // REDUCED PULL: Multiplying by 0.4 makes the inward journey much slower
                          this.x += dirX * force * 0.4; 
                          this.y += dirY * force * 0.4;

                          // Orbit rotation speed
                          let orbitSpeed = 0.4 * force;
                          this.x += -dirY * orbitSpeed;
                          this.y += dirX * orbitSpeed;

                          // SLOWER FADE LOGIC: Math.pow makes the opacity stay higher for longer, 
                          // creating a smooth cinematic dissolve instead of a linear drop-off.
                          this.opacity = 0.7 * Math.pow(1 - force, 1.5); 
                      }
                  } else {
                      // Smoothly bring opacity back to normal if the mouse moves away
                      if (this.opacity < 0.7) this.opacity += 0.01; // Slower fade-in
                  }
              } else {
                  // Smoothly restore opacity if the mouse leaves the screen entirely
                  if (this.opacity < 0.7) this.opacity += 0.01;
              }
              
              this.draw();
          }
        }

        // Initialize particle array
        function init() {
            particlesArray.length = 0;
            const count = calculateParticleCount();
            for (let i = 0; i < count; i++) {
                particlesArray.push(new Particle());
            }
        }

        // Draw lines connecting nearby particles (and connecting particles to the mouse)
function connectParticles() {
    let opacityValue = 1;
    const maxDistance = 120; // Maximum distance for lines between particles
    const mouseMaxDistance = 180; // Maximum distance a particle can hook to your mouse

    // 1. Connect particles to the MOUSE (New Anchor Effect)
    if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < particlesArray.length; i++) {
            let dx = particlesArray[i].x - mouse.x;
            let dy = particlesArray[i].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseMaxDistance) {
                // Fade the line out as the node gets further from the cursor
                opacityValue = 1 - (distance / mouseMaxDistance);
                
                // We'll make the mouse connection slightly brighter/more opaque than standard lines
                ctx.strokeStyle = `rgba(0, 242, 254, ${opacityValue * 0.45})`; 
                ctx.lineWidth = 1.5; // Slightly thicker line for mouse interaction
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    // 2. Connect particles to EACH OTHER (Standard network)
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                opacityValue = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(0, 242, 254, ${opacityValue * 0.25})`; 
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    
    connectParticles();
    requestAnimationFrame(animate);
}

// Run
init();
animate();

// Handle window resize dynamically adjusting particle array size
window.addEventListener('resize', () => {
    init();
});