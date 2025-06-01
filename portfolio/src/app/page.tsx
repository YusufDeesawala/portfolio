"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Html } from "@react-three/drei"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, ExternalLink, Mail, Sun, Moon, Code, Zap, Star, Send } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useFBX } from "@react-three/drei"
import * as THREE from "three"

// Enhanced Typewriter Effect with Matrix Glitch
function TechTypeWriter({ text, delay = 100, onComplete }) {
  const [mounted, setMounted] = useState(false)
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(
        () => {
          if (Math.random() < 0.15) {
            setIsGlitching(true)
            setTimeout(() => setIsGlitching(false), 150)
          }
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        },
        delay + Math.random() * 100,
      )
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, delay, onComplete])

  return (
    <div className="relative">
      <span
        className={`
          text-6xl lg:text-8xl font-bold 
          bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 
          bg-clip-text text-transparent
          ${isGlitching ? "animate-pulse filter blur-sm" : ""}
        `}
        style={{
          textShadow: isGlitching ? "0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88" : "none",
          filter: isGlitching ? "hue-rotate(180deg) saturate(2)" : "none",
        }}
      >
        {displayText}
        <span
          className={`
            ${showCursor ? "opacity-100" : "opacity-0"} 
            transition-opacity duration-100 
            text-emerald-400
          `}
          style={{
            textShadow: "0 0 15px #00ff88, 0 0 30px #00ff88",
          }}
        >
          |
        </span>
      </span>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted &&
          [...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-emerald-400/30 text-xs font-mono select-none"
              initial={{ y: -50, opacity: 0 }}
              animate={{
                y: [0, 200, 0],
                opacity: [0, 1, 0.5, 0],
                scale: [0.8, 1, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              style={{
                left: `${(i * 3.33) % 100}%`,
              }}
            >
              {`${Math.random().toString(36).substring(2, 8)}`}
            </motion.div>
          ))}
      </div>
    </div>
  )
}

// Custom 3D Model Component with Enhanced Interactions
function Custom3DModel({ mousePosition }) {
  const meshRef = useRef(null)
  const { viewport, camera } = useThree()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Load FBX model
  let model = null
  try {
    model = useFBX("/3d_model/source/pc.fbx")
    console.log("Model loaded successfully:", model)
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          console.log("Material found:", child.material)
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.metalness = 0.2
              mat.roughness = 0.7
              if (mat.map) {
                mat.toneMapped = false
              }
              mat.needsUpdate = true
            })
          } else {
            child.material.metalness = 0.2
            child.material.roughness = 0.7
            if (child.material.map) {
              child.material.toneMapped = false
            }
            child.material.needsUpdate = true
          }
        }
      }
    })
    model.rotation.y = -Math.PI / 2
  } catch (error) {
    console.error("Failed to load FBX model:", error)
    model = null
  }

  useFrame((state) => {
    if (meshRef.current) {
      const targetRotationY = (mousePosition.x * viewport.width) / 15
      const targetRotationX = (mousePosition.y * viewport.height) / 25

      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.05)
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.05)

      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3 + (hovered ? 0.2 : 0)

      const targetScale = hovered ? 1.1 : clicked ? 0.95 : 1
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1))
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
      >
        {model ? (
          <primitive object={model} scale={[0.005, 0.005, 0.005]} />
        ) : (
          // Fallback Procedural Model
          <>
            <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[4, 0.3, 2.5]} />
              <meshStandardMaterial
                color="#0a0a0a"
                metalness={0.9}
                roughness={0.1}
                emissive="#00ff88"
                emissiveIntensity={hovered ? 0.3 : 0.1}
              />
            </mesh>
            <mesh position={[0, 0.8, -1.1]} rotation={[-0.15, 0, 0]} castShadow>
              <boxGeometry args={[3.5, 2.2, 0.1]} />
              <meshStandardMaterial
                color="#000"
                metalness={0.8}
                roughness={0.2}
                emissive="#001122"
                emissiveIntensity={0.2}
              />
            </mesh>
            <mesh position={[0, 0.8, -1.05]} rotation={[-0.15, 0, 0]}>
              <planeGeometry args={[3.2, 2]} />
              <meshStandardMaterial
                color="#00ff88"
                emissive="#00ff88"
                emissiveIntensity={hovered ? 0.8 : 0.4}
                transparent
                opacity={0.7}
              />
            </mesh>
            {[...Array(6)].map((_, i) => (
              <Float key={i} speed={3 + i} rotationIntensity={0.5} floatIntensity={0.8}>
                <mesh
                  position={[
                    Math.sin((i * Math.PI) / 3) * 2.5,
                    1.5 + Math.sin(i) * 0.5,
                    Math.cos((i * Math.PI) / 3) * 2.5,
                  ]}
                >
                  <octahedronGeometry args={[0.1 + i * 0.02]} />
                  <meshStandardMaterial
                    color={`hsl(${180 + i * 30}, 80%, 60%)`}
                    emissive={`hsl(${180 + i * 30}, 80%, 40%)`}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              </Float>
            ))}
            {[...Array(3)].map((_, i) => (
              <mesh key={i} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.5 + i * 0.5, 1.6 + i * 0.5, 32]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.2 - i * 0.05} side={THREE.DoubleSide} />
              </mesh>
            ))}
            <group>
              {[...Array(20)].map((_, i) => (
                <Float key={i} speed={2 + Math.random() * 3} rotationIntensity={1} floatIntensity={2}>
                  <mesh position={[(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 8]}>
                    <sphereGeometry args={[0.02]} />
                    <meshBasicMaterial color="#00ff88" transparent opacity={0.6} />
                  </mesh>
                </Float>
              ))}
            </group>
            <Html position={[0, 2.5, 0]} center>
              <motion.div
                className="text-cyan-400 font-mono text-sm pointer-events-none select-none"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {hovered ? "SYSTEM_ENHANCED" : "NEURAL_INTERFACE"}
              </motion.div>
            </Html>
          </>
        )}
      </group>
    </Float>
  )
}

// Enhanced 3D Scene with Advanced Lighting
function Enhanced3DScene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 2, 6], fov: 60 }}
      shadows
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.3 }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[3, 5, 3]}
        intensity={0.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight
        position={[8, 8, 8]}
        intensity={0.7}
        color="#00ff88"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#ff0080" />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#00aaff" />
      <fog attach="fog" args={["#000011", 5, 20]} />
      <Environment preset="studio" />
      <Custom3DModel mousePosition={mousePosition} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={12}
      />
    </Canvas>
  )
}

// Enhanced Neural Network with Advanced Particle Physics
function AdvancedNeuralNetwork() {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    setMounted(true)

    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: Math.random(),
          energy: Math.random(),
          connections: [],
        })
      }
    }

    initParticles()
    window.addEventListener("resize", initParticles)
    return () => window.removeEventListener("resize", initParticles)
  }, [])

  useEffect(() => {
    if (!mounted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life += 0.008
        particle.energy = Math.sin(particle.life * Math.PI * 2) * 0.5 + 0.5

        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.vx *= -0.8
          particle.energy += 0.2
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.vy *= -0.8
          particle.energy += 0.2
        }

        if (particle.life > 1) {
          particle.life = 0
          particle.energy = Math.random()
        }

        particle.connections = []
        particlesRef.current.forEach((other, otherIndex) => {
          if (index !== otherIndex) {
            const distance = Math.sqrt(Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2))
            if (distance < 80) {
              particle.connections.push(otherIndex)
            }
          }
        })
      })

      particlesRef.current.forEach((particle) => {
        const alpha = Math.sin(particle.life * Math.PI) * 0.4 + 0.1
        const size = (Math.sin(particle.life * Math.PI) * 1.5 + 1) * (particle.energy + 0.3)
        const pulseIntensity = particle.energy * 0.8 + 0.2

        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size * 3)
        gradient.addColorStop(0, `rgba(0, 255, 136, ${alpha * pulseIntensity})`)
        gradient.addColorStop(0.5, `rgba(0, 200, 255, ${alpha * 0.6})`)
        gradient.addColorStop(1, `rgba(255, 0, 128, 0)`)

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`
        ctx.fill()
      })

      particlesRef.current.forEach((particle, index) => {
        particle.connections.forEach((connectionIndex) => {
          const other = particlesRef.current[connectionIndex]
          const distance = Math.sqrt(Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2))

          if (distance < 80) {
            const alpha = (1 - distance / 80) * 0.3
            const energyFlow = (particle.energy + other.energy) / 2

            const gradient = ctx.createLinearGradient(particle.x, particle.y, other.x, other.y)
            gradient.addColorStop(0, `rgba(0, 255, 136, ${alpha * energyFlow})`)
            gradient.addColorStop(0.3, `rgba(0, 200, 255, ${alpha * 0.8})`)
            gradient.addColorStop(0.7, `rgba(100, 150, 255, ${alpha * 0.6})`)
            gradient.addColorStop(1, `rgba(255, 0, 128, ${alpha * energyFlow})`)

            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = alpha * 3 * energyFlow
            ctx.stroke()

            const pulsePosition = (Date.now() * 0.005) % 1
            const pulseX = particle.x + (other.x - particle.x) * pulsePosition
            const pulseY = particle.y + (other.y - particle.y) * pulsePosition

            ctx.beginPath()
            ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`
            ctx.fill()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        background: "transparent",
        mixBlendMode: "screen",
      }}
    />
  )
}

// Enhanced Glitch Effect with Audio-Visual Sync
function AdvancedGlitchEffect() {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchIntensity, setGlitchIntensity] = useState(0)

  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setIsGlitching(true)
        setGlitchIntensity(Math.random())
        setTimeout(
          () => {
            setIsGlitching(false)
            setGlitchIntensity(0)
          },
          200 + Math.random() * 300,
        )
      },
      8000 + Math.random() * 4000,
    )

    return () => clearInterval(glitchInterval)
  }, [])

  if (!isGlitching) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        className="absolute inset-0 bg-red-500/20"
        animate={{
          x: [-2, 2, -1, 1, 0],
          opacity: [0, glitchIntensity * 0.8, 0],
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-green-500/20"
        animate={{
          x: [1, -1, 2, -2, 0],
          opacity: [0, glitchIntensity * 0.6, 0],
        }}
        transition={{ duration: 0.2, ease: "easeInOut", delay: 0.05 }}
      />
      <motion.div
        className="absolute inset-0 bg-blue-500/20"
        animate={{
          x: [-1, 1, -2, 2, 0],
          opacity: [0, glitchIntensity * 0.7, 0],
        }}
        transition={{ duration: 0.2, ease: "easeInOut", delay: 0.1 }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)",
        }}
        animate={{
          y: [0, 4, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 0.1, repeat: 2 }}
      />
    </div>
  )
}

// Enhanced Theme Toggle with Smooth Transitions
function EnhancedThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <div className="w-12 h-12 bg-background/80 backdrop-blur-sm border border-primary/40 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <motion.div className="fixed top-6 right-6 z-50" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-12 h-12 bg-background/80 backdrop-blur-sm border-primary/40 hover:border-primary/80 hover:bg-primary/10 transition-all duration-500 shadow-lg shadow-primary/20 rounded-xl relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -180, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 180, opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="relative z-10"
            >
              <Sun className="w-5 h-5 text-yellow-500 drop-shadow-lg" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 180, opacity: 0, scale: 0 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -180, opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="relative z-10"
              >
                <Moon className="w-5 h-5 text-blue-400 drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    )
  }

  // Enhanced Project Card with 3D Hover Effects
  function EnhancedProjectCard({ project, index }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        whileHover={{
          y: -20,
          scale: 1.05,
          rotateX: 5,
          rotateY: 5,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group perspective-1000"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-primary/30 hover:border-primary/70 transition-all duration-700 overflow-hidden relative transform-gpu">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5"
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          />
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={project.image}
              alt={`${project.title} preview`}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1,
                opacity: isHovered ? 0.9 : 1,
              }}
              transition={{ duration: 0.5 }}
              onError={(e) => {
                e.target.src = "/placeholder-project.jpg" // Fallback image
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
              animate={{
                x: isHovered ? ["0%", "100%", "0%"] : "0%",
                opacity: isHovered ? [0, 1, 0] : 0,
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            {isHovered &&
              [...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/60 rounded-full"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    scale: 0,
                  }}
                  animate={{
                    y: [null, "-100%"],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                />
              ))}
          </div>
          <CardContent className="p-6 relative z-10">
            <motion.h3
              className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300 text-foreground"
              animate={{ z: isHovered ? 20 : 0 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {project.title}
            </motion.h3>
            <motion.p
              className="text-muted-foreground mb-4 leading-relaxed"
              animate={{ z: isHovered ? 10 : 0 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {project.description}
            </motion.p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, techIndex) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: techIndex * 0.1 }}
                  whileHover={{ scale: 1.1, z: 10 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-300"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05, z: 15 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: "preserve-3d" }}
                className="flex-1"
              >
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, z: 15 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: "preserve-3d" }}
                className="flex-1"
              >
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/80 hover:to-blue-500/80 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <a
                    href={project.liveDemoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Timeline Item Component with Enhanced 3D Effects
  function TimelineItem({ item, index }) {
    const [isVisible, setIsVisible] = useState(false)

    return (
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, rotateY: index % 2 === 0 ? -15 : 15 }}
        whileInView={{
          opacity: 1,
          x: 0,
          rotateY: 0,
          transition: { duration: 0.8, delay: index * 0.3 },
        }}
        onViewportEnter={() => setIsVisible(true)}
        whileHover={{
          scale: 1.02,
          z: 20,
          rotateX: 2,
        }}
        className={`flex items-center gap-4 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex-1">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-500 transform-gpu">
            <CardContent className="p-6">
              <motion.div
                className="flex items-center gap-3 mb-3"
                animate={{ z: isVisible ? 10 : 0 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  animate={{
                    rotate: isVisible ? 360 : 0,
                    scale: isVisible ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <Zap className="w-6 h-6 text-primary drop-shadow-lg" />
                </motion.div>
                <h3 className="font-bold text-foreground text-lg">{item.title}</h3>
              </motion.div>
              <motion.p
                className="text-sm text-muted-foreground mb-2 font-medium"
                animate={{ z: isVisible ? 5 : 0 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {item.company}
              </motion.p>
              <motion.p
                className="text-xs text-primary font-bold mb-3 tracking-wider"
                animate={{ z: isVisible ? 5 : 0 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {item.period}
              </motion.p>
              <motion.p
                className="text-sm text-foreground leading-relaxed"
                animate={{ z: isVisible ? 5 : 0 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {item.description}
              </motion.p>
            </CardContent>
          </Card>
        </div>
        <motion.div
          className="w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg shadow-primary/50 relative z-10"
          whileHover={{ scale: 1.5, boxShadow: "0 0 30px rgba(0,255,136,0.8)" }}
          animate={{
            boxShadow: isVisible
              ? ["0 0 10px rgba(0,255,136,0.5)", "0 0 30px rgba(0,255,136,0.8)", "0 0 10px rgba(0,255,136,0.5)"]
              : "0 0 10px rgba(0,255,136,0.5)",
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
        <div className="flex-1" />
      </motion.div>
    )
  }

  // Enhanced Contact Form with Real-time Validation
  function ContactForm() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [focusedField, setFocusedField] = useState(null)

    const handleSubmit = async (e) => {
      e.preventDefault()
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Form submitted:", formData)
      setIsSubmitting(false)
      setFormData({ name: "", email: "", message: "" })
    }

    const handleChange = (e) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }))
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: -10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: "backOut" }}
        className="max-w-2xl mx-auto perspective-1000"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-primary/30 relative overflow-hidden transform-gpu">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5"
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <CardContent className="p-8 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div whileHover={{ z: 10 }} style={{ transformStyle: "preserve-3d" }}>
                  <label className="block text-sm font-medium mb-2 text-primary">Name</label>
                  <motion.div
                    animate={{
                      scale: focusedField === "name" ? 1.02 : 1,
                      boxShadow: focusedField === "name" ? "0 0 20px rgba(0,255,136,0.3)" : "none",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className="bg-background/50 border-primary/30 focus:border-primary/70 text-foreground transition-all duration-300"
                      placeholder="Your awesome name"
                      required
                    />
                  </motion.div>
                </motion.div>
                <motion.div whileHover={{ z: 10 }} style={{ transformStyle: "preserve-3d" }}>
                  <label className="block text-sm font-medium mb-2 text-primary">Email</label>
                  <motion.div
                    animate={{
                      scale: focusedField === "email" ? 1.02 : 1,
                      boxShadow: focusedField === "email" ? "0 0 20px rgba(0,255,136,0.3)" : "none",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="bg-background/50 border-primary/30 focus:border-primary/70 text-foreground transition-all duration-300"
                      placeholder="your.email@universe.com"
                      required
                    />
                  </motion.div>
                </motion.div>
              </div>
              <motion.div whileHover={{ z: 10 }} style={{ transformStyle: "preserve-3d" }}>
                <label className="block text-sm font-medium mb-2 text-primary">Message</label>
                <motion.div
                  animate={{
                    scale: focusedField === "message" ? 1.02 : 1,
                    boxShadow: focusedField === "message" ? "0 0 20px rgba(0,255,136,0.3)" : "none",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className="bg-background/50 border-primary/30 focus:border-primary/70 min-h-[120px] text-foreground transition-all duration-300"
                    placeholder="Tell me about your incredible project ideas..."
                    required
                  />
                </motion.div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, z: 15 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 hover:from-primary/80 hover:via-purple-500/80 hover:to-blue-500/80 text-white font-bold py-4 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    animate={{
                      x: isSubmitting ? ["0%", "100%"] : "-100%",
                    }}
                    transition={{
                      duration: isSubmitting ? 2 : 0.5,
                      repeat: isSubmitting ? Number.POSITIVE_INFINITY : 0,
                    }}
                  />
                  <motion.div
                    className="flex items-center justify-center gap-3 relative z-10"
                    animate={{
                      scale: isSubmitting ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: isSubmitting ? Number.POSITIVE_INFINITY : 0,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        </motion.div>
                        Launching Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Launch Message 🚀
                      </>
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Simple Tech Grid
  function TechStackShowcase() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    const technologies = [
      { name: "React", logo: "/logos/react.png" },
      { name: "Docker", logo: "/logos/docker.png" },
      { name: "Flask", logo: "/logos/flask.png" },
      { name: "Git", logo: "/logos/git.png" },
      { name: "HTML", logo: "/logos/html.png" },
      { name: "CSS", logo: "/logos/text.png" },
      { name: "MongoDB", logo: "/logos/mongo.png" },
      { name: "PostgreSQL", logo: "/logos/postgre.png" },
      { name: "Python", logo: "/logos/python.png" },
      { name: "PyTorch", logo: "/logos/pytorch.png" },
      { name: "TensorFlow", logo: "/logos/tensorflow.png" },
      { name: "JavaScript", logo: "/logos/js.png" },
    ]

    if (!mounted) {
      return (
        <div className="h-96 lg:h-[600px] flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )
    }

    return (
      <div className="h-96 lg:h-[600px] flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <TechSphere technologies={technologies} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>
    )
  }

  function TechSphere({ technologies }) {
    const groupRef = useRef()
    const sphereRadius = 4  

    useFrame((state) => {
      if (groupRef.current) {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      }
    })

    // Calculate positions on sphere surface
    const positions = technologies.map((_, index) => {
      const phi = Math.acos(-1 + (2 * index) / technologies.length)
      const theta = Math.sqrt(technologies.length * Math.PI) * phi

      return [
        sphereRadius * Math.cos(theta) * Math.sin(phi),
        sphereRadius * Math.cos(phi),
        sphereRadius * Math.sin(theta) * Math.sin(phi),
      ]
    })

    return (
      <group ref={groupRef}>
        {technologies.map((tech, index) => (
          <TechLogo key={tech.name} position={positions[index]} logo={tech.logo} name={tech.name} />
        ))}
      </group>
    )
  }

  function TechLogo({ position, logo, name }) {
    const meshRef = useRef()
    const [hovered, setHovered] = useState(false)

    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.lookAt(0, 0, 0)
        meshRef.current.rotation.z = 0
      }
    })

    return (
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          scale={hovered ? 1.2 : 1}
        >
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <Html center>
          <motion.div
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-primary/20 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={logo || "/placeholder.svg"}
              alt={`${name} logo`}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.style.display = "none"
              }}
            />
          </motion.div>
        </Html>
      </group>
    )
  }

  // Main Portfolio Component with All Enhancements
  export default function Portfolio() {
    const [mounted, setMounted] = useState(false)
    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const projectsRef = useRef(null)
    const contactRef = useRef(null)

    const skills = ["Full Stack Developer", "Data Scientist", "Problem Solver", "ML Engineer", "Code Wizard", "Kaggler"]
    const [currentSkill, setCurrentSkill] = useState(0)
    const [typewriterComplete, setTypewriterComplete] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      if (!mounted) return

      const interval = setInterval(() => {
        setCurrentSkill((prev) => (prev + 1) % skills.length)
      }, 3000)
      return () => clearInterval(interval)
    }, [skills.length, mounted])

    const projects = [
      {
        title: "Meet Sync",
        description:
          "A next-gen meeting assistant with AI-driven task management, real-time transcription, and smart action item extraction — from emails to to-dos.",
        technologies: ["React", "MongoDB", "Python", "AI/ML", "JavaScript", "Groq", "HTML", "CSS", "Flask"],
        githubLink: "https://github.com/YusufDeesawala/meet-sync",
        liveDemoLink: "https://meet-sync.onrender.com/",
        image: "/projects/meetsync.png", // Placeholder: Replace with actual project image path
      },
      {
        title: "Resume Analyzer",
        description:
          "An AI-powered resume analyzer tailored to your dream company — with smart job search and an interview-ready chatbot to guide your prep.",
        technologies: ["Python", "HTML", "CSS", "Flask", "Gemini", "Machine Learning", "Data Science"],
        githubLink: "https://github.com/YusufDeesawala/resume-analyser",
        liveDemoLink: "https://resume-analyzer-ntn9.onrender.com/",
        image: "/projects/resume-analyser.jpeg", // Placeholder: Replace with actual project image path
      },
      {
        title: "Spam Classifier",
        description:
          "A powerful spam classifier built from scratch using advanced machine learning techniques — filtering the noise with precision, speed, and intelligence.",
        technologies: ["Python", "Streamlit", "Machine Learning", "NLP", "Data Science"],
        githubLink: "https://github.com/YusufDeesawala/Spam-Classification",
        liveDemoLink: "https://spam-detector-repo.streamlit.app/",
        image: "/projects/spam.png", // Placeholder: Replace with actual project image path
      },
    ]

    const experience = [
      {
        title: "Started Coding in HTML & CSS",
        company: "GRD Public School",
        period: "2015 - 2018",
        description:
          "Began learning web development with HTML and CSS, creating simple and structured web pages. This early experience sparked my passion for building clean and user-friendly digital interfaces.",
      },
      {
        title: "Learnt Python",
        company: "GRD Public School",
        period: "2018 - 2021",
        description:
          "Learned Python fundamentals, focusing on problem-solving and basic programming concepts. Developed a strong foundation in coding logic and scripting through hands-on projects and practice.",
      },
      {
        title: "Data Scientist",
        company: "KGiSL Institute of Technology",
        period: "2021 - 2023",
        description:
          "Worked on data analysis, cleaning, and visualization to extract actionable insights from complex datasets. Applied machine learning techniques and statistical models to support decision-making and improve project outcomes.",
      },
      {
        title: "Full Stack Development & ML Engineering",
        company: "KGiSL Institute of Technology",
        period: "2023 - Present",
        description:
          "Building full-stack applications while applying machine learning models to solve real-world problems. Combining backend and frontend development with data-driven insights to create impactful solutions.",
      },
    ]

    const scrollToSection = (ref) => {
      ref.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground overflow-x-hidden relative">
        <AdvancedNeuralNetwork />
        <AdvancedGlitchEffect />
        <EnhancedThemeToggle />
        <section className="min-h-screen flex items-center justify-center relative z-20">
          <motion.div style={{ y }} className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10" />
          </motion.div>
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center z-10">
            <motion.div
              initial={{ opacity: 0, x: -100, rotateY: -30 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1.2, ease: "backOut" }}
              className="space-y-8"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <TechTypeWriter text="Yusuf Deesawala" delay={130} onComplete={() => setTypewriterComplete(true)} />
              </motion.div>
              <AnimatePresence>
                {typewriterComplete && (
                  <motion.div
                    className="text-2xl lg:text-3xl h-16"
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "backOut" }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentSkill}
                        initial={{ opacity: 0, y: 30, rotateX: -90, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, rotateX: 90, scale: 0.8 }}
                        transition={{ duration: 0.8, ease: "backOut" }}
                        className="flex items-center gap-3"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <motion.div
                          animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                          }}
                        >
                          <Zap className="w-8 h-8 text-primary drop-shadow-lg" />
                        </motion.div>
                        <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent font-bold">
                          {skills[currentSkill]}
                        </span>
                      </motion.span>
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.p
                className="text-lg text-muted-foreground max-w-md leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                Building digital experiences that go beyond the screen. Code. Design. Innovation — welcome to my world. 🌌
              </motion.p>
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, z: 10 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Button
                    size="lg"
                    onClick={() => scrollToSection(projectsRef)}
                    className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/80 hover:to-purple-500/80 text-white font-bold relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <Star className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Explore My Universe</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, z: 10 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => scrollToSection(contactRef)}
                    className="border-primary/50 hover:bg-primary/10 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                    <Mail className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Contact the Wizard</span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              className="h-96 lg:h-[500px]"
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "backOut" }}
            >
              <Suspense
                fallback={
                  <div className="h-96 lg:h-[500px] flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full"
                    />
                  </div>
                }
              >
                <Enhanced3DScene />
              </Suspense>
            </motion.div>
          </div>
        </section>
        <section className="py-20 relative z-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                The Mind Behind the Code
              </h2>
              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="w-80 h-80 mx-auto relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-full blur-xl opacity-40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <div className="relative w-full h-full bg-gradient-to-br from-muted/80 to-muted/40 rounded-full flex items-center justify-center border-2 border-primary/30 backdrop-blur-sm">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src="/yusuf.jpeg"
                        alt="Yusuf Deesawala"
                        className="w-64 h-64 object-cover rounded-full shadow-lg"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Creative Developer
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I’m a curious developer with 2 years of coding experience, focused on creating simple, effective, and
                  engaging digital experiences. I enjoy learning new technologies and turning ideas into functional,
                  well-crafted solutions.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Exploring the creative side of code is what keeps me inspired — every project is a chance to push
                  boundaries and build something meaningful.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Badge
                      variant="secondary"
                      className="text-sm px-4 py-2 bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/30"
                    >
                      🚀 Code with Purpose
                    </Badge>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Badge
                      variant="secondary"
                      className="text-sm px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30"
                    >
                      💡 Solutions First
                    </Badge>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Badge
                      variant="secondary"
                      className="text-sm px-4 py-2 bg-gradient-to-r from-blue-500/20 to-primary/20 border-blue-500/30"
                    >
                      🎯 Precision Focused
                    </Badge>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 relative z-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                The Path
              </h2>
              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-purple-500 to-blue-500" />
                <div className="space-y-12">
                  {experience.map((item, index) => (
                    <TimelineItem key={index} item={item} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 relative z-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Technologies I Use
              </h2>
              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto mb-8"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Here are the core technologies I work with to build amazing digital experiences! 💻
              </p>
            </motion.div>
            <motion.div
              className="h-96 lg:h-[600px]"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <TechStackShowcase />
            </motion.div>
          </div>
        </section>
        <section ref={projectsRef} className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 relative z-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                My Projects
              </h2>
              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto mb-8"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here’s a curated selection of my work. Each project reflects my approach to solving problems through thoughtful design and technology. I enjoy exploring new ideas and pushing what's possible in the digital space.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects.map((project, index) => (
                <EnhancedProjectCard key={index} project={project} index={index} />
              ))}
            </div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-gradient-to-r from-background/80 to-background/40 backdrop-blur-sm border-primary/50 hover:border-primary/80 flex items-center justify-center gap-2"
                >
                  <a
                    href="https://github.com/YusufDeesawala?tab=repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Explore All Projects</span>
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
        <section ref={contactRef} className="py-20 relative z-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Contact Me
              </h2>
              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto mb-8"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ready to embark on an interdimensional journey of innovation? Let's collaborate and create something that
                transcends the boundaries of reality itself! 🌌
              </p>
            </motion.div>
            <ContactForm />
          </div>
        </section>
        <footer className="py-8 border-t border-primary/20 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm relative z-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-muted-foreground">
                © 2024 Yusuf Deesawala. Crafted with 💚, cosmic energy, and alien-level programming skills across multiple
                dimensions.
              </p>
            </motion.div>
          </div>
        </footer>
      </div>
    )
  }