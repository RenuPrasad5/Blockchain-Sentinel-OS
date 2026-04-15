import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

// Configuration
const COLORS = {
    BG: "#05070a"
};

const Scene = () => {
    return (
        <Suspense fallback={null}>
            <color attach="background" args={[COLORS.BG]} />
            <fog attach="fog" args={[COLORS.BG, 20, 90]} />
            <Stars radius={150} depth={50} count={7000} factor={6} saturation={0} fade speed={3} />
        </Suspense>
    );
};

const NeuralDataNetwork = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return <div className="fixed inset-0 bg-[#05070a]" />;

    return (
        <div id="neural-void-bg" className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#05070a]">
            {/* Intensified grain/noise overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
            
            <Canvas 
                camera={{ position: [0, 0, 45], fov: 45 }}
                gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
                dpr={[1, 2]}
            >
                <Scene />
            </Canvas>

            {/* Premium Atmospheric overlays */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_300px_rgba(0,0,0,1)]" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05070a] via-transparent to-transparent opacity-95" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,7,10,0.8)_100%)]" />
        </div>
    );
};

export default NeuralDataNetwork;
