import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, Points, PointMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Configuration - Ultra Premium "High-Visibility" Mode
const COLORS = {
    CYAN: "#00f3ff",
    BLUE: "#00a2ff",
    PURPLE: "#9d66ff",
    BG: "#05070a",
    GRID: "#003366",
    PACKET: "#ffffff",
    GLOW: "#00ffff"
};

const NODE_COUNT = 160;
const CUBE_COUNT = 24;
const CONNECTION_DISTANCE = 16;
const PACKET_COUNT = 50;

// --- Background Components ---

const InfrastructureGrid = () => (
    <group position={[0, -12, -20]} rotation={[Math.PI / 2.1, 0, 0]}>
        <gridHelper args={[200, 50, COLORS.GRID, COLORS.GRID]} opacity={0.2} transparent />
    </group>
);

// --- Data Flow Packets ---

const DataPacket = ({ start, end }) => {
    const meshRef = useRef();
    const progress = useRef(Math.random());
    const speed = useMemo(() => 0.004 + Math.random() * 0.008, []);
    
    useFrame(() => {
        if (!meshRef.current) return;
        progress.current = (progress.current + speed) % 1;
        
        const p = progress.current;
        meshRef.current.position.x = start[0] + (end[0] - start[0]) * p;
        meshRef.current.position.y = start[1] + (end[1] - start[1]) * p;
        meshRef.current.position.z = start[2] + (end[2] - start[2]) * p;
        
        // Brighter packet glow
        meshRef.current.material.opacity = Math.sin(p * Math.PI) * 0.8;
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color={COLORS.CYAN} transparent opacity={0} blending={THREE.AdditiveBlending} />
        </mesh>
    );
};

// --- Main Interactive Components ---

const BlockchainNetwork = ({ mouseX, mouseY }) => {
    const { viewport } = useThree();
    const lineRef = useRef();
    const nodeRef = useRef();

    const nodes = useMemo(() => {
        return Array.from({ length: NODE_COUNT }).map(() => ({
            pos: [
                (Math.random() - 0.5) * viewport.width * 3.5,
                (Math.random() - 0.5) * viewport.height * 3.5,
                (Math.random() - 0.5) * 25 - 5
            ]
        }));
    }, [viewport]);

    const connections = useMemo(() => {
        const pairs = [];
        for (let i = 0; i < nodes.length; i++) {
            let count = 0;
            for (let j = i + 1; j < nodes.length && count < 2; j++) {
                const dist = new THREE.Vector3(...nodes[i].pos).distanceTo(new THREE.Vector3(...nodes[j].pos));
                if (dist < CONNECTION_DISTANCE) {
                    pairs.push([i, j]);
                    count++;
                }
            }
        }
        return pairs;
    }, [nodes]);

    const packets = useMemo(() => {
        return Array.from({ length: PACKET_COUNT }).map(() => {
            const conn = connections[Math.floor(Math.random() * connections.length)];
            return conn ? { start: nodes[conn[0]].pos, end: nodes[conn[1]].pos } : null;
        }).filter(Boolean);
    }, [connections, nodes]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (!lineRef.current) return;

        const positions = new Float32Array(connections.length * 6);
        connections.forEach(([i, j], idx) => {
            const start = nodes[i].pos;
            const end = nodes[j].pos;

            const driftX = mouseX.current * 4.5;
            const driftY = mouseY.current * 4.5;

            positions[idx * 6] = start[0] + driftX;
            positions[idx * 6 + 1] = start[1] + driftY;
            positions[idx * 6 + 2] = start[2];
            positions[idx * 6 + 3] = end[0] + driftX;
            positions[idx * 6 + 4] = end[1] + driftY;
            positions[idx * 6 + 5] = end[2];
        });

        lineRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        lineRef.current.geometry.attributes.position.needsUpdate = true;
        
        // Brighter pulse
        lineRef.current.material.opacity = 0.25 + (Math.sin(time * 1.5) + 1) * 0.2;
    });

    return (
        <group>
            <lineSegments ref={lineRef}>
                <bufferGeometry />
                <lineBasicMaterial transparent color={COLORS.BLUE} blending={THREE.AdditiveBlending} depthTest={false} />
            </lineSegments>

            <Points ref={nodeRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={NODE_COUNT}
                        array={new Float32Array(nodes.flatMap(n => n.pos))}
                        itemSize={3}
                    />
                </bufferGeometry>
                <PointMaterial
                    transparent
                    color={COLORS.CYAN}
                    size={0.4} // Further increased
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {packets.map((p, i) => (
                <DataPacket key={i} start={p.start} end={p.end} />
            ))}
        </group>
    );
};

const FloatingBlock = ({ position, mouseX, mouseY }) => {
    const meshRef = useRef();
    const hash = useMemo(() => Math.random().toString(16).slice(2, 6).toUpperCase(), []);
    const speed = useMemo(() => 0.15 + Math.random() * 0.2, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = time * speed;
            meshRef.current.rotation.y = time * (speed * 0.8);

            meshRef.current.position.x = position[0] + mouseX.current * 18; // Stronger parallax
            meshRef.current.position.y = position[1] + mouseY.current * 18;
            meshRef.current.position.z = position[2] + Math.sin(time * 0.5 + position[0]) * 5;
        }
    });

    return (
        <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.2}>
            <group position={position}>
                <mesh ref={meshRef}>
                    <boxGeometry args={[2.8, 2.8, 2.8]} />
                    <meshBasicMaterial color={COLORS.PURPLE} wireframe transparent opacity={0.6} blending={THREE.AdditiveBlending} />
                    
                    <Suspense fallback={null}>
                        <Text
                            fontSize={0.35}
                            color={COLORS.CYAN}
                            position={[0, 0, 1.41]}
                            font="https://fonts.gstatic.com/s/robotomono/v12/L0tkDFwvuaCwsiZu47umS-5vXCcE.woff"
                            opacity={1}
                            textAlign="center"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {hash}
                        </Text>
                    </Suspense>
                </mesh>
                
                {/* Intensified core pulse glow */}
                <mesh>
                    <sphereGeometry args={[1.0, 16, 16]} />
                    <meshBasicMaterial color={COLORS.BLUE} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
                </mesh>
            </group>
        </Float>
    );
};

const Scene = () => {
    const { viewport, mouse } = useThree();
    const mouseX = useRef(0);
    const mouseY = useRef(0);

    const cubePositions = useMemo(() => {
        return Array.from({ length: CUBE_COUNT }).map(() => [
            (Math.random() - 0.5) * viewport.width * 3.0,
            (Math.random() - 0.5) * viewport.height * 3.0,
            (Math.random() - 0.5) * 15 + 12
        ]);
    }, [viewport]);

    useFrame(() => {
        mouseX.current = THREE.MathUtils.lerp(mouseX.current, mouse.x, 0.04);
        mouseY.current = THREE.MathUtils.lerp(mouseY.current, mouse.y, 0.04);
    });

    return (
        <Suspense fallback={null}>
            <color attach="background" args={[COLORS.BG]} />
            <fog attach="fog" args={[COLORS.BG, 20, 90]} />
            
            <InfrastructureGrid />
            
            <BlockchainNetwork mouseX={mouseX} mouseY={mouseY} />

            {cubePositions.map((pos, i) => (
                <FloatingBlock key={i} position={pos} mouseX={mouseX} mouseY={mouseY} />
            ))}

            <Stars radius={150} depth={50} count={7000} factor={8} saturation={1} fade speed={4} />
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
