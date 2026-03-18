import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';


const BLOCK_COUNT = 45;
const PARTICLE_COUNT = 3000;
const CONNECTION_DISTANCE = 15;
const NEURAL_GREEN = "#00ce46";
const SAFFRON = "#FF9933";
const WHITE = "#FFFFFF";

// Helper to create a gradient-colored wireframe box
const createSovereignBox = (geometry) => {
    const edges = new THREE.EdgesGeometry(geometry);
    const count = edges.attributes.position.count;
    const colors = new Float32Array(count * 3);
    
    const saffronColor = new THREE.Color(SAFFRON);
    const whiteColor = new THREE.Color(WHITE);
    
    for (let i = 0; i < count; i++) {
        const y = edges.attributes.position.getY(i);
        // Box is 1.2 units tall, so y is -0.6 to 0.6
        const lerpFactor = THREE.MathUtils.clamp((y / 1.2) + 0.5, 0, 1);
        const mixedColor = new THREE.Color().lerpColors(whiteColor, saffronColor, lerpFactor);
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }
    
    edges.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return edges;
};

const DataBlock = ({ position, isSovereign, mouseOffset }) => {
    const groupRef = useRef();
    const lineRef = useRef();
    const innerMeshRef = useRef();
    const activeRef = useRef(0);
    
    useFrame((state) => {
        if (!groupRef.current) return;

        // Slow motion mouse drift
        const targetX = position[0] + mouseOffset.x * 2;
        const targetY = position[1] + mouseOffset.y * 2;
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.02);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.02);

        // Collision logic simulation
        const time = state.clock.elapsedTime;
        const pulse = Math.sin(time * 2 - position[0] * 0.5) * 0.5 + 0.5;
        const intensity = Math.pow(pulse, 3); // Sharper activation
        activeRef.current = intensity;

        if (lineRef.current) {
            if (isSovereign) {
                const pulseColor = new THREE.Color().lerpColors(
                    new THREE.Color(WHITE),
                    new THREE.Color(SAFFRON),
                    intensity
                );
                lineRef.current.material.color.copy(pulseColor);
                lineRef.current.material.opacity = 0.3 + intensity * 0.5;
            } else {
                const targetColor = new THREE.Color(NEURAL_GREEN);
                const baseColor = new THREE.Color("#444444");
                const mixed = new THREE.Color().lerpColors(baseColor, targetColor, intensity);
                lineRef.current.material.color.copy(mixed);
                lineRef.current.material.opacity = 0.2 + intensity * 0.6;
            }
        }

        if (innerMeshRef.current) {
            innerMeshRef.current.scale.setScalar(intensity * 0.8 || 0.001);
            innerMeshRef.current.material.opacity = intensity * 0.2;
        }

        groupRef.current.rotation.y += 0.01;
        groupRef.current.rotation.z += 0.005;
    });

    const geometry = useMemo(() => new THREE.BoxGeometry(1.2, 1.2, 1.2), []);
    const sovereignEdges = useMemo(() => createSovereignBox(geometry), [geometry]);
    const normalEdges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

    return (
        <group ref={groupRef} position={position}>
            <lineSegments ref={lineRef} geometry={isSovereign ? sovereignEdges : normalEdges}>
                <lineBasicMaterial 
                    transparent 
                    vertexColors={isSovereign} 
                    color={isSovereign ? "#FFFFFF" : NEURAL_GREEN}
                    linewidth={1.5}
                />
            </lineSegments>
            
            <mesh ref={innerMeshRef}>
                <sphereGeometry args={[0.5, 12, 12]} />
                <meshBasicMaterial 
                    color={NEURAL_GREEN} 
                    transparent 
                    opacity={0} 
                />
            </mesh>
        </group>
    );
};

const DataStream = ({ mouseOffset }) => {
    const pointsRef = useRef();
    
    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        const vel = new Float32Array(PARTICLE_COUNT);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 60; // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 40; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
            vel[i] = 0.1 + Math.random() * 0.2; // Speed from right to left
        }
        return { positions: pos, velocities: vel };
    }, []);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        
        const posAttr = pointsRef.current.geometry.attributes.position;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Move left
            posAttr.array[i * 3] -= velocities[i];
            
            // If out of bounds, wrap around to the right
            if (posAttr.array[i * 3] < -30) {
                posAttr.array[i * 3] = 30;
                posAttr.array[i * 3 + 1] = (Math.random() - 0.5) * 40;
            }

            // Mouse interaction: particles drift slightly
            posAttr.array[i * 3 + 1] += mouseOffset.y * 0.05;
        }
        posAttr.needsUpdate = true;

        // Subtle rotation of the whole cloud
        pointsRef.current.rotation.y = mouseOffset.x * 0.1;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute 
                    attach="attributes-position"
                    count={PARTICLE_COUNT}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial 
                size={0.12} 
                color={NEURAL_GREEN} 
                transparent 
                opacity={0.4} 
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const NeuralPathways = ({ blocks, mouseOffset }) => {
    const lineRef = useRef();
    
    const lines = useMemo(() => {
        const connections = [];
        for (let i = 0; i < blocks.length; i++) {
            let count = 0;
            for (let j = i + 1; j < blocks.length && count < 2; j++) {
                const dist = new THREE.Vector3(...blocks[i].pos).distanceTo(new THREE.Vector3(...blocks[j].pos));
                if (dist < CONNECTION_DISTANCE) {
                    connections.push([i, j]);
                    count++;
                }
            }
        }
        return connections;
    }, [blocks]);

    useFrame((state) => {
        if (!lineRef.current) return;
        const time = state.clock.elapsedTime;
        
        const positions = new Float32Array(lines.length * 6);
        const colors = new Float32Array(lines.length * 6);
        
        lines.forEach(([i, j], index) => {
            const start = blocks[i].pos;
            const end = blocks[j].pos;
            
            // Mouse drift applied to pathways too
            const offsetX = mouseOffset.x * 2;
            const offsetY = mouseOffset.y * 2;

            positions[index * 6] = start[0] + offsetX;
            positions[index * 6 + 1] = start[1] + offsetY;
            positions[index * 6 + 2] = start[2];
            
            positions[index * 6 + 3] = end[0] + offsetX;
            positions[index * 6 + 4] = end[1] + offsetY;
            positions[index * 6 + 5] = end[2];

            const alpha = 0.05 + (Math.sin(time + index) + 1) * 0.05;
            for (let k = 0; k < 6; k++) {
                colors[index * 6 + k] = alpha;
            }
        });
        
        lineRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        lineRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 1));
        lineRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <lineSegments ref={lineRef}>
            <bufferGeometry />
            <lineBasicMaterial 
                color={NEURAL_GREEN} 
                transparent 
                opacity={0.2}
                vertexColors={true}
            />
        </lineSegments>
    );
};

const Scene = () => {
    const { viewport } = useThree();
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    
    const blocks = useMemo(() => {
        return Array.from({ length: BLOCK_COUNT }).map(() => ({
            pos: [
                (Math.random() - 0.5) * viewport.width * 2,
                (Math.random() - 0.5) * viewport.height * 2,
                (Math.random() - 0.5) * 10
            ],
            isSovereign: Math.random() < 0.1 // 10% Sovereign Trace
        }));
    }, [viewport]);

    useFrame((state) => {
        // Slow-motion mouse interaction
        setMouseOffset({
            x: THREE.MathUtils.lerp(mouseOffset.x, state.mouse.x * (viewport.width / 10), 0.03),
            y: THREE.MathUtils.lerp(mouseOffset.y, state.mouse.y * (viewport.height / 10), 0.03)
        });
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <DataStream mouseOffset={mouseOffset} />
            {blocks.map((block, i) => (
                <DataBlock 
                    key={i} 
                    position={block.pos} 
                    isSovereign={block.isSovereign} 
                    mouseOffset={mouseOffset}
                />
            ))}
            <NeuralPathways blocks={blocks} mouseOffset={mouseOffset} />
        </>
    );
};

const NeuralDataNetwork = () => {
    return (
        <div 
            id="neural-void-bg"
            className="fixed inset-0 z-[-1] pointer-events-none bg-[#0D1117]"
        >
            <div className="w-full h-full" style={{ opacity: 0.17 }}>
                <Canvas camera={{ position: [0, 0, 25], fov: 50 }}>
                    <Scene />
                </Canvas>
            </div>
            
            {/* Visual scanline/vignette overlays for atmospheric feel */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0D1117]/50" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle,rgba(0,206,70,0.4)_0%,transparent_70%)]" />
        </div>
    );
};

export default NeuralDataNetwork;
