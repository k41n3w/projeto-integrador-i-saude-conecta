"use client"

import { useEffect, useRef } from "react"

export default function OgImageGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar tamanho do canvas
    canvas.width = 1200
    canvas.height = 630

    // Desenhar fundo azul
    ctx.fillStyle = "#0284c7" // Azul médico
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Desenhar cruz branca
    ctx.fillStyle = "#ffffff"
    const crossWidth = 100
    const crossHeight = 400
    // Vertical
    ctx.fillRect(canvas.width / 2 - crossWidth / 2, canvas.height / 2 - crossHeight / 2, crossWidth, crossHeight)
    // Horizontal
    ctx.fillRect(canvas.width / 2 - crossHeight / 2, canvas.height / 2 - crossWidth / 2, crossHeight, crossWidth)

    // Adicionar texto
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 60px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Rascunho do Projeto Integrador I", canvas.width / 2, canvas.height / 2 + 200)

    ctx.font = "30px Arial"
    ctx.fillText("Feito por k41n3w + vercel v0", canvas.width / 2, canvas.height / 2 + 260)

    // Exportar como imagem
    const dataUrl = canvas.toDataURL("image/png")

    // Em um ambiente real, você salvaria esta imagem
    console.log("Imagem OG gerada:", dataUrl)

    // Opcional: Mostrar como baixar a imagem
    const downloadLink = document.createElement("a")
    downloadLink.href = dataUrl
    downloadLink.download = "og-image.png"
    downloadLink.textContent = "Baixar imagem OG"
    downloadLink.style.display = "block"
    downloadLink.style.marginTop = "10px"
    canvas.parentNode?.appendChild(downloadLink)
  }, [])

  return (
    <div className="hidden">
      <canvas ref={canvasRef} />
    </div>
  )
}
