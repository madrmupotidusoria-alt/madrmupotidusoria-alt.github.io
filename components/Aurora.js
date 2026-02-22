// Simple Aurora Background Implementation
export default function Aurora(props) {
    const { colorStops = ['#5227FF', '#7cff67', '#5227FF'], amplitude = 1.0, blend = 0.5, speed = 2.0 } = props;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Aurora animation
    let time = 0;
    
    function animate() {
        time += 0.01 * speed;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        // Add color stops with animation
        const offset1 = Math.sin(time) * 0.1;
        const offset2 = Math.cos(time * 0.7) * 0.1;
        
        gradient.addColorStop(0, colorStops[0]);
        gradient.addColorStop(0.5 + offset1, colorStops[1]);
        gradient.addColorStop(1, colorStops[2]);
        
        // Draw aurora with noise effect
        ctx.globalAlpha = 0.3 * blend;
        ctx.fillStyle = gradient;
        
        // Create wave effect
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 10) {
            const y = canvas.height * 0.3 + 
                     Math.sin((x * 0.01) + time) * 50 * amplitude +
                     Math.cos((x * 0.02) + time * 1.5) * 30 * amplitude;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        
        // Add second layer
        ctx.globalAlpha = 0.2 * blend;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 10) {
            const y = canvas.height * 0.4 + 
                     Math.sin((x * 0.015) + time * 1.2) * 40 * amplitude +
                     Math.cos((x * 0.025) + time * 0.8) * 25 * amplitude;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    return canvas;
}
