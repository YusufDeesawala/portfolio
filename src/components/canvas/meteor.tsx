
import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { random } from "maath";
import * as THREE from "three";

const MeteorShower = (props: any) => {
  const ref = useRef<THREE.Points>();
  const [meteors, setMeteors] = useState<any[]>([]);

  useEffect(() => {
    // Generate random meteors with position and velocity
    const numMeteors = 500;
    const generatedMeteors = new Array(numMeteors).fill(0).map(() => ({
      position: new THREE.Vector3(
        Math.random() * 2 - 1, // Random X
        Math.random() * 2 - 1, // Random Y
        Math.random() * 2 - 1  // Random Z
      ),
      velocity: new THREE.Vector3(
        Math.random() * 0.01,  // Random X velocity
        Math.random() * -0.05, // Negative Y velocity for falling down
        Math.random() * 0.01   // Random Z velocity
      ),
    }));

    setMeteors(generatedMeteors);
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) {
      // Update positions of meteors
      setMeteors((prevMeteors) => 
        prevMeteors
          .map((meteor) => {
            meteor.position.add(meteor.velocity);
            // Reset position if meteor moves out of the scene (optional)
            if (meteor.position.y < -1) {
              meteor.position.set(
                Math.random() * 2 - 1,
                1, // reset to top
                Math.random() * 2 - 1
              );
            }
            return meteor;
          })
      );
    }
  });

  // Flatten meteor positions into an array of floats (needed by Points)
  const meteorPositions = meteors.flatMap((meteor) => [
    meteor.position.x,
    meteor.position.y,
    meteor.position.z,
  ]);

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={meteorPositions} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.02} // Increased size for meteors
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export default MeteorShower;
