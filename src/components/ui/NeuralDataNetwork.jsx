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
            <Stars radius={200} depth={60} count={10000} factor={8} saturation={0} fade speed={2} />
        </Suspense>
    );
};

const NeuralDataNetwork = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return <div className="fixed inset-0 bg-[#05070a]" />;

    return (
        <div id="neural-void-bg" className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-transparent">
            {/* Intensified grain/noise overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
            
            <Canvas 
                camera={{ position: [0, 0, 45], fov: 45 }}
                gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
                dpr={[1, 2]}
            >
                <Scene />
            </Canvas>

            {/* Premium Atmospheric overlays - reduced to ensure stars are visible */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05070a]/40 via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,7,10,0.4)_100%)]" />
        </div>
    );
};

export default NeuralDataNetwork;
