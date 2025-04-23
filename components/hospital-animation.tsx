"use client"

import { useEffect, useRef, useState } from "react"

export default function HospitalAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const animationRef = useRef<number | null>(null)

  // Detectar tamanho da tela e se é dispositivo móvel
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement
        setDimensions({
          width: parent.clientWidth,
          height: isMobile ? 300 : 400,
        })
        setIsMobile(window.innerWidth < 768)
      }
    }

    // Configuração inicial
    setIsMobile(window.innerWidth < 768)
    handleResize()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", handleResize)

    // Limpar listener
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMobile])

  // Configurar e animar o canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar tamanho do canvas
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Cores
    const primaryColor = "#0284c7" // Azul médico
    const secondaryColor = "#06b6d4" // Azul claro
    const accentColor = "#f43f5e" // Rosa/vermelho para corações

    // Elementos da animação
    const people = []
    const icons = []

    // Classe para pessoas
    class Person {
      x: number
      y: number
      targetX: number
      targetY: number
      size: number
      speed: number
      color: string
      connected: boolean
      pulseSize: number
      pulseOpacity: number

      constructor() {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.min(canvas.width, canvas.height) * 0.4

        this.x = canvas.width / 2 + Math.cos(angle) * radius
        this.y = canvas.height / 2 + Math.sin(angle) * radius
        this.targetX = canvas.width / 2
        this.targetY = canvas.height / 2
        this.size = isMobile ? 8 : 12
        this.speed = 0.3 + Math.random() * 0.7
        this.color = secondaryColor
        this.connected = false
        this.pulseSize = 0
        this.pulseOpacity = 1
      }

      update() {
        if (!this.connected) {
          // Mover em direção ao hospital
          const dx = this.targetX - this.x
          const dy = this.targetY - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 5) {
            this.x += (dx / distance) * this.speed
            this.y += (dy / distance) * this.speed
          } else {
            this.connected = true
            this.pulseSize = this.size
            this.pulseOpacity = 1
          }
        } else {
          // Animação de pulso quando conectado
          this.pulseSize += 0.3
          this.pulseOpacity -= 0.01

          if (this.pulseOpacity <= 0) {
            this.pulseSize = this.size
            this.pulseOpacity = 1
          }
        }
      }

      draw() {
        if (!ctx) return

        // Desenhar pessoa
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        // Desenhar linha de conexão ao hospital
        if (this.connected) {
          ctx.strokeStyle = this.color
          ctx.lineWidth = isMobile ? 1 : 1.5
          ctx.beginPath()
          ctx.moveTo(this.x, this.y)
          ctx.lineTo(canvas.width / 2, canvas.height / 2)
          ctx.stroke()

          // Desenhar pulso de conexão
          ctx.globalAlpha = this.pulseOpacity
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.pulseSize, 0, Math.PI * 2)
          ctx.strokeStyle = accentColor
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      }
    }

    // Classe para ícones médicos
    class MedicalIcon {
      x: number
      y: number
      size: number
      type: string
      angle: number
      speed: number
      opacity: number

      constructor() {
        const radius = Math.min(canvas.width, canvas.height) * 0.3
        const angle = Math.random() * Math.PI * 2

        this.x = canvas.width / 2 + Math.cos(angle) * (radius * Math.random())
        this.y = canvas.height / 2 + Math.sin(angle) * (radius * Math.random())
        this.size = (isMobile ? 12 : 16) + Math.random() * (isMobile ? 4 : 8)
        this.type = ["heart", "plus", "pulse"][Math.floor(Math.random() * 3)]
        this.angle = Math.random() * Math.PI * 2
        this.speed = 0.1 + Math.random() * 0.2
        this.opacity = 0.3 + Math.random() * 0.3
      }

      update() {
        this.angle += this.speed / 100
        this.x += Math.cos(this.angle) * 0.1
        this.y += Math.sin(this.angle) * 0.1

        // Pulsar opacidade
        this.opacity = 0.3 + Math.sin(Date.now() / 1000) * 0.2
      }

      draw() {
        if (!ctx) return

        ctx.globalAlpha = this.opacity

        // Desenhar ícone baseado no tipo
        if (this.type === "heart") {
          ctx.fillStyle = accentColor
          ctx.beginPath()
          ctx.arc(this.x - this.size / 4, this.y - this.size / 4, this.size / 4, 0, Math.PI * 2)
          ctx.arc(this.x + this.size / 4, this.y - this.size / 4, this.size / 4, 0, Math.PI * 2)
          ctx.moveTo(this.x, this.y + this.size / 2)
          ctx.lineTo(this.x - this.size / 2, this.y)
          ctx.lineTo(this.x, this.y - this.size / 2)
          ctx.lineTo(this.x + this.size / 2, this.y)
          ctx.closePath()
          ctx.fill()
        } else if (this.type === "plus") {
          ctx.fillStyle = primaryColor
          ctx.fillRect(this.x - this.size / 6, this.y - this.size / 2, this.size / 3, this.size)
          ctx.fillRect(this.x - this.size / 2, this.y - this.size / 6, this.size, this.size / 3)
        } else if (this.type === "pulse") {
          ctx.strokeStyle = accentColor
          ctx.lineWidth = isMobile ? 1 : 1.5
          ctx.beginPath()
          ctx.moveTo(this.x - this.size / 2, this.y)
          ctx.lineTo(this.x - this.size / 4, this.y)
          ctx.lineTo(this.x - this.size / 8, this.y - this.size / 3)
          ctx.lineTo(this.x + this.size / 8, this.y + this.size / 3)
          ctx.lineTo(this.x + this.size / 4, this.y)
          ctx.lineTo(this.x + this.size / 2, this.y)
          ctx.stroke()
        }

        ctx.globalAlpha = 1
      }
    }

    // Criar pessoas e ícones
    const numPeople = isMobile ? 5 : 7
    const numIcons = isMobile ? 8 : 12

    for (let i = 0; i < numPeople; i++) {
      people.push(new Person())
    }

    for (let i = 0; i < numIcons; i++) {
      icons.push(new MedicalIcon())
    }

    // Desenhar hospital
    const drawHospital = () => {
      if (!ctx) return

      const x = canvas.width / 2
      const y = canvas.height / 2
      const size = Math.min(canvas.width, canvas.height) / (isMobile ? 3.5 : 4.5)

      // Desenhar prédio do hospital
      ctx.fillStyle = primaryColor
      ctx.fillRect(x - size / 2, y - size / 2, size, size)

      // Cruz do hospital
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x - size / 6, y - size / 3, size / 3, (size * 2) / 3)
      ctx.fillRect(x - size / 3, y - size / 6, (size * 2) / 3, size / 3)
    }

    // Função de animação
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Atualizar e desenhar ícones
      icons.forEach((icon) => {
        icon.update()
        icon.draw()
      })

      // Desenhar hospital
      drawHospital()

      // Atualizar e desenhar pessoas
      people.forEach((person) => {
        person.update()
        person.draw()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Iniciar animação
    animate()

    // Limpar animação quando o componente for desmontado
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, isMobile])

  return (
    <div className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: dimensions.width > 0 ? "block" : "none" }} />
    </div>
  )
}
