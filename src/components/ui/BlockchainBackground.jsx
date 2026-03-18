import React, { useRef, useEffect } from 'react';

/**
 * High-performance, subtle animated background for the 'Void Black' theme.
 * Visual: 'Particle-Link' system representing a blockchain.
 * Interaction: Accelerates toward points on 'blockchain-node-hover' event.
 */
const BlockchainBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        
        // Configuration
        const NODE_COLOR = '#00ce46';
        const LINE_COLOR = 'rgba(0, 206, 70, 0.08)';
        const PARTICLE_COUNT_RATIO = 12000; // 1 particle per 12000 pixels
        const CONNECTION_DIST = 100;
        const BASE_SPEED = 0.25;
        const ACCEL_STRENGTH = 1.2;
        const DECEL_STRENGTH = 0.94;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / PARTICLE_COUNT_RATIO);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * BASE_SPEED,
                    vy: (Math.random() - 0.5) * BASE_SPEED,
                    size: Math.random() * 1.5 + 0.5,
                    ax: 0,
                    ay: 0,
                    active: false
                });
            }
        };

        const handleNodeHover = (e) => {
            if (!e.detail || typeof e.detail.x === 'undefined') return;
            const { x, y } = e.detail;
            
            particles.forEach(p => {
                const dx = x - p.x;
                const dy = y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 400) {
                    const force = (400 - dist) / 400;
                    p.ax = (dx / dist) * force * ACCEL_STRENGTH;
                    p.ay = (dy / dist) * force * ACCEL_STRENGTH;
                    p.active = true;
                }
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Set styles once for efficiency
            ctx.fillStyle = NODE_COLOR;
            ctx.lineWidth = 0.5;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Physics update
                if (p.active) {
                    p.vx += p.ax;
                    p.vy += p.ay;
                    p.ax *= DECEL_STRENGTH;
                    p.ay *= DECEL_STRENGTH;
                    
                    if (Math.abs(p.ax) < 0.01 && Math.abs(p.ay) < 0.01) {
                        p.active = false;
                        p.ax = 0;
                        p.ay = 0;
                    }
                }

                // Smooth speed cap for controlled aesthetics
                const maxSpeed = p.active ? 2.5 : BASE_SPEED;
                const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (currentSpeed > maxSpeed) {
                    p.vx = (p.vx / currentSpeed) * maxSpeed;
                    p.vy = (p.vy / currentSpeed) * maxSpeed;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Boundary wrapping
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Connection Logic
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
                        const dist = Math.sqrt(distSq);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 206, 70, ${0.12 * (1 - dist / CONNECTION_DIST)})`;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('blockchain-node-hover', handleNodeHover);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('blockchain-node-hover', handleNodeHover);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="blockchain-background-canvas"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                opacity: 0.15,
                pointerEvents: 'none',
                background: '#0D1117'
            }}
        />
    );
};

export default BlockchainBackground;
