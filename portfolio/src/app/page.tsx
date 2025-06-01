"use client"

import type React from "react"
import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Text3D, Float } from "@react-three/drei"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, ExternalLink, Mail, Sun, Moon, Code, Zap, Star, Send } from "lucide-react"
import { useTheme } from "next-themes"
import type * as THREE from "three"

// Technological Typewriter Effect with Glitch
function TechTypeWriter({ text, delay = 100, onComplete }: { text: string; delay?: number; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isGlitching, setIsGlitching] = useState(false)

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
          // Random glitch effect
          if (Math.random() < 0.1) {
            setIsGlitching(true)
            setTimeout(() => setIsGlitching(false), 100)
          }

          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        },
        delay + Math.random() * 50,
      ) // Variable delay for more realistic typing
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
          textShadow: isGlitching ? "0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88" : "none",
          filter: isGlitching ? "hue-rotate(90deg)" : "none",
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
            textShadow: "0 0 10px #00ff88, 0 0 20px #00ff88",
          }}
        >
          |
        </span>
      </span>

      {/* Matrix-style background effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-400/20 text-xs font-mono"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 100, opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          >
            {Math.random().toString(36).substring(7)}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Interactive 3D Laptop Model
function InteractiveLaptopModel() {
  const meshRef = useRef<THREE.Group>(null)
  const { viewport, mouse } = useThree()

  useFrame((state) => {
    if (meshRef.current) {
      // Mouse interaction
      meshRef.current.rotation.y = (mouse.x * viewport.width) / 10
      meshRef.current.rotation.x = (mouse.y * viewport.height) / 20

      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={meshRef}>
        {/* Laptop Base */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[3, 0.2, 2]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
            emissive="#00ff88"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Laptop Screen */}
        <mesh position={[0, 0.5, -0.9]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[2.8, 1.8, 0.1]} />
          <meshStandardMaterial color="#000" metalness={0.8} />
        </mesh>

        {/* Screen Content - Animated */}
        <mesh position={[0, 0.5, -0.85]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[2.6, 1.6]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} transparent opacity={0.8} />
        </mesh>

        {/* Holographic Effect */}
        <mesh position={[0, 1.5, -0.5]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#ff0080" emissive="#ff0080" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>

        {/* Table with Neon Edge */}
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[5, 0.2, 3]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.8}
            roughness={0.2}
            emissive="#0080ff"
            emissiveIntensity={0.05}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Solar System Tech Orb
function SolarSystemTechOrb({
  position,
  tech,
  color,
  orbitRadius,
  orbitSpeed,
}: {
  position: [number, number, number]
  tech: string
  color: string
  orbitRadius: number
  orbitSpeed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * orbitSpeed
      meshRef.current.position.x = Math.cos(time) * orbitRadius
      meshRef.current.position.z = Math.sin(time) * orbitRadius
      meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.5
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.9}
        />
        <Text3D font="/fonts/Geist_Bold.json" size={0.06} height={0.02} position={[-0.2, -0.03, 0.4]}>
          {tech}
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </Text3D>
      </mesh>
    </Float>
  )
}

// Solar System Tech Universe
function SolarSystemTechUniverse() {
  const groupRef = useRef<THREE.Group>(null)

  const innerOrbit = [
    { name: "React", color: "#61dafb", radius: 2.5, speed: 0.8 },
    { name: "Vue", color: "#4fc08d", radius: 2.5, speed: 0.8 },
    { name: "Angular", color: "#dd0031", radius: 2.5, speed: 0.8 },
  ]

  const middleOrbit = [
    { name: "Node.js", color: "#68a063", radius: 4, speed: 0.5 },
    { name: "Python", color: "#3776ab", radius: 4, speed: 0.5 },
    { name: "TypeScript", color: "#3178c6", radius: 4, speed: 0.5 },
    { name: "Go", color: "#00add8", radius: 4, speed: 0.5 },
  ]

  const outerOrbit = [
    { name: "Docker", color: "#2496ed", radius: 5.5, speed: 0.3 },
    { name: "AWS", color: "#ff9900", radius: 5.5, speed: 0.3 },
    { name: "MongoDB", color: "#47a248", radius: 5.5, speed: 0.3 },
    { name: "PostgreSQL", color: "#336791", radius: 5.5, speed: 0.3 },
    { name: "Redis", color: "#dc382d", radius: 5.5, speed: 0.3 },
  ]

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.1}
        />
        <Text3D font="/fonts/Geist_Bold.json" size={0.08} height={0.02} position={[-0.15, -0.05, 0.8]}>
          ME
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </Text3D>
      </mesh>

      {/* Orbital Rings */}
      {[2.5, 4, 5.5].map((radius, index) => (
        <mesh key={index} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>
      ))}

      {/* Inner Orbit Planets */}
      {innerOrbit.map((tech, index) => (
        <SolarSystemTechOrb
          key={tech.name}
          position={[tech.radius, 0, 0]}
          tech={tech.name}
          color={tech.color}
          orbitRadius={tech.radius}
          orbitSpeed={tech.speed + index * 0.1}
        />
      ))}

      {/* Middle Orbit Planets */}
      {middleOrbit.map((tech, index) => (
        <SolarSystemTechOrb
          key={tech.name}
          position={[tech.radius, 0, 0]}
          tech={tech.name}
          color={tech.color}
          orbitRadius={tech.radius}
          orbitSpeed={tech.speed + index * 0.1}
        />
      ))}

      {/* Outer Orbit Planets */}
      {outerOrbit.map((tech, index) => (
        <SolarSystemTechOrb
          key={tech.name}
          position={[tech.radius, 0, 0]}
          tech={tech.name}
          color={tech.color}
          orbitRadius={tech.radius}
          orbitSpeed={tech.speed + index * 0.05}
        />
      ))}
    </group>
  )
}

// Enhanced Tech Stack Canvas Component
function EnhancedTechStack() {
  return (
    <Canvas camera={{ position: [0, 5, 8], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0080" />
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#ffd700" />
      <Environment preset="night" />

      <SolarSystemTechUniverse />

      <OrbitControls enableZoom={true} autoRotate={false} />
    </Canvas>
  )
}

// Enhanced Neural Network Particles
function EnhancedNeuralNetworkParticles() {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number }>>([])

  useEffect(() => {
    setMounted(true)

    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 100; i++) {
        particlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: Math.random(),
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

      // Update particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life += 0.01

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1

        // Reset life cycle
        if (particle.life > 1) particle.life = 0
      })

      // Draw particles with pulsing effect
      particlesRef.current.forEach((particle) => {
        const alpha = Math.sin(particle.life * Math.PI) * 0.8 + 0.2
        const size = Math.sin(particle.life * Math.PI) * 2 + 1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`
        ctx.fill()

        // Add glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = "#00ff88"
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw connections with enhanced visuals
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + Math.pow(particle.y - otherParticle.y, 2),
          )

          if (distance < 120) {
            const alpha = (1 - distance / 120) * 0.6
            const gradient = ctx.createLinearGradient(particle.x, particle.y, otherParticle.x, otherParticle.y)
            gradient.addColorStop(0, `rgba(0, 255, 136, ${alpha})`)
            gradient.addColorStop(0.5, `rgba(0, 200, 255, ${alpha * 0.8})`)
            gradient.addColorStop(1, `rgba(255, 0, 128, ${alpha * 0.6})`)

            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = alpha * 2
            ctx.stroke()
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

// Glitch Effect Component
function GlitchEffect() {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 300)
    }, 7000)

    return () => clearInterval(glitchInterval)
  }, [])

  if (!isGlitching) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="w-full h-full bg-gradient-to-r from-red-500/30 via-transparent to-blue-500/30 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/20 to-transparent animate-bounce" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ2xpdGNoIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InRyYW5zcGFyZW50Ii8+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMTAwIiB5Mj0iMTAwIiBzdHJva2U9IiMwMGZmODgiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dsaXRjaCkiLz48L3N2Zz4=')] opacity-20" />
    </div>
  )
}

// Fixed Theme Toggle
function FixedThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <div className="w-10 h-10 bg-background/80 backdrop-blur-sm border border-primary/40 rounded-md animate-pulse" />
      </div>
    )
  }

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <motion.div className="fixed top-6 right-6 z-50" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
        className="bg-background/80 backdrop-blur-sm border-primary/40 hover:border-primary/80 hover:bg-primary/10 transition-all duration-300 shadow-lg shadow-primary/20"
      >
        <AnimatePresence mode="wait">
          {currentTheme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-4 h-4 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-4 h-4 text-blue-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}

// Enhanced Project Card
function EnhancedProjectCard({ project, index }: { project: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -15, scale: 1.03 }}
      className="group"
    >
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-primary/30 hover:border-primary/70 transition-all duration-500 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.5 }}>
              <Code className="w-16 h-16 text-primary/80" />
            </motion.div>
          </div>
        </div>

        <CardContent className="p-6 relative z-10">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300 text-foreground">
            {project.title}
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech: string) => (
              <Badge key={tech} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 hover:bg-primary/10">
              <Github className="w-4 h-4 mr-2" />
              Code
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/80 hover:to-blue-500/80"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Timeline Item Component
function TimelineItem({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`flex items-center gap-4 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
    >
      <div className="flex-1">
        <Card className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">{item.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{item.company}</p>
            <p className="text-xs text-primary font-medium mb-2">{item.period}</p>
            <p className="text-sm text-foreground">{item.description}</p>
          </CardContent>
        </Card>
      </div>
      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg shadow-primary/50" />
      <div className="flex-1" />
    </motion.div>
  )
}

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // EmailJS integration will go here
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-primary/30">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-background/50 border-primary/30 focus:border-primary/70 text-foreground"
                  placeholder="Your awesome name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-primary">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background/50 border-primary/30 focus:border-primary/70 text-foreground"
                  placeholder="your.email@universe.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-primary">Message</label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="bg-background/50 border-primary/30 focus:border-primary/70 min-h-[120px] text-foreground"
                placeholder="Tell me about your incredible project ideas..."
                required
              />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 hover:from-primary/80 hover:via-purple-500/80 hover:to-blue-500/80 text-white font-bold py-3"
              >
                <Send className="w-5 h-5 mr-2" />
                Launch Message to Space 🚀
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Client-side wrapper for 3D components
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-96 lg:h-[500px] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return <>{children}</>
}

// Main Portfolio Component
export default function Portfolio() {
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  const skills = [
    "Full Stack Developer",
    "UI/UX Designer",
    "Problem Solver",
    "Tech Enthusiast",
    "Code Wizard",
    "Digital Architect",
  ]
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
      title: "Quantum E-Commerce Platform",
      description:
        "A next-generation e-commerce solution with AI-powered recommendations and real-time quantum inventory management.",
      technologies: ["React", "Node.js", "MongoDB", "AI/ML", "Quantum Computing"],
    },
    {
      title: "Neural Chat Interface",
      description:
        "An advanced AI chatbot with consciousness-level natural language processing and emotional intelligence.",
      technologies: ["Python", "TensorFlow", "React", "WebSocket", "Neural Networks"],
    },
    {
      title: "Cosmic Task Management",
      description:
        "A galactic-scale project management tool with interdimensional collaboration and time-space synchronization.",
      technologies: ["Next.js", "PostgreSQL", "Prisma", "Socket.io", "Blockchain"],
    },
  ]

  const experience = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Innovations Inc.",
      period: "2022 - Present",
      description:
        "Leading development of scalable web applications and mentoring junior developers in the art of code wizardry.",
    },
    {
      title: "Frontend Developer",
      company: "Digital Solutions Ltd.",
      period: "2020 - 2022",
      description:
        "Developed responsive user interfaces and improved application performance by 40% using alien technologies.",
    },
    {
      title: "Junior Developer",
      company: "StartUp Ventures",
      period: "2019 - 2020",
      description:
        "Built and maintained web applications using modern JavaScript frameworks and cosmic programming principles.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground overflow-x-hidden relative">
      <EnhancedNeuralNetworkParticles />
      <GlitchEffect />
      <FixedThemeToggle />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative z-20">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10" />
        </motion.div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <TechTypeWriter text="John Doe" delay={150} onComplete={() => setTypewriterComplete(true)} />
            </motion.div>

            <AnimatePresence>
              {typewriterComplete && (
                <motion.div
                  className="text-2xl lg:text-3xl h-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSkill}
                      initial={{ opacity: 0, y: 20, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -20, rotateX: 90 }}
                      transition={{ duration: 0.6 }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Zap className="w-8 h-8 text-primary" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent font-bold">
                        {skills[currentSkill]}
                      </span>
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p
              className="text-lg text-muted-foreground max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              Crafting digital experiences that transcend dimensions and push the boundaries of what's possible. Welcome
              to my universe of code, creativity, and cosmic innovation! 🌌
            </motion.p>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/80 hover:to-purple-500/80 text-white font-bold"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Explore My Universe
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact the Wizard
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="h-96 lg:h-[500px]"
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <ClientOnly>
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
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0080" />
                  <Environment preset="night" />
                  <InteractiveLaptopModel />
                </Canvas>
              </Suspense>
            </ClientOnly>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              About the Cosmic Developer
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
                    className="text-8xl"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    🧙‍♂️
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
                Passionate Developer & Cosmic Architect
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With over 5 years of experience traversing the digital cosmos, I specialize in creating innovative
                solutions that blend cutting-edge technology with otherworldly user experiences. My journey through the
                tech universe has been powered by an insatiable curiosity and a passion for solving problems that others
                deem impossible.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When I'm not coding in multiple dimensions, you'll find me exploring quantum algorithms, contributing to
                intergalactic open-source projects, or mentoring fellow developers in the ancient arts of programming. I
                believe in the power of technology to transform not just ideas, but entire realities.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Badge
                    variant="secondary"
                    className="text-sm px-4 py-2 bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/30"
                  >
                    🚀 Innovation Driven
                  </Badge>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Badge
                    variant="secondary"
                    className="text-sm px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30"
                  >
                    💡 Problem Solver
                  </Badge>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Badge
                    variant="secondary"
                    className="text-sm px-4 py-2 bg-gradient-to-r from-blue-500/20 to-primary/20 border-blue-500/30"
                  >
                    🎯 Detail Oriented
                  </Badge>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              My Cosmic Journey
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

      {/* Solar System Tech Universe */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Solar System of Skills
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Welcome to my technological solar system! Each planet represents a mastered technology orbiting around my
              core expertise. Watch as they dance in perfect cosmic harmony! 🌌
            </p>
          </motion.div>

          <motion.div
            className="h-96 lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <ClientOnly>
              <Suspense
                fallback={
                  <div className="h-96 lg:h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-muted-foreground">Loading Solar System...</p>
                    </div>
                  </div>
                }
              >
                <EnhancedTechStack />
              </Suspense>
            </ClientOnly>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Cosmic Projects
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A showcase of my interdimensional work - projects that demonstrate my passion for creating innovative
              solutions and pushing the boundaries of what's possible in the digital cosmos.
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
                size="lg"
                variant="outline"
                className="bg-gradient-to-r from-background/80 to-background/40 backdrop-blur-sm border-primary/50 hover:border-primary/80"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Explore All Dimensions
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Connect Across Dimensions
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

      {/* Footer */}
      <footer className="py-8 border-t border-primary/20 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-muted-foreground">
              © 2024 John Doe. Crafted with 💚, cosmic energy, and alien-level programming skills across multiple
              dimensions.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
