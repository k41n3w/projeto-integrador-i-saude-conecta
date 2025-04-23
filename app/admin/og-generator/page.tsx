"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OgGeneratorPage() {
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
    ctx.fillText("SaúdeConecta", canvas.width / 2, canvas.height / 2 + 150)

    ctx.font = "bold 30px Arial"
    ctx.fillText("Saúde Acessível Para Todos", canvas.width / 2, canvas.height / 2 + 200)

    ctx.font = "24px Arial"
    ctx.fillText(
      "Conectando pacientes com serviços médicos gratuitos e de baixo custo",
      canvas.width / 2,
      canvas.height / 2 + 250,
    )
  }, [])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = "og-image.png"
    link.click()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerador de Imagem de Preview</h1>
        <p className="text-muted-foreground">Use esta página para gerar a imagem de preview para o site</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="border rounded-lg overflow-hidden" style={{ maxWidth: "100%" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "auto", maxWidth: "1200px" }} />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleDownload}>Baixar Imagem</Button>
          <Link href="/">
            <Button variant="outline">Voltar para o Início</Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-bold mb-2">Instruções</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Clique em "Baixar Imagem" para salvar a imagem de preview</li>
            <li>
              Coloque a imagem na pasta <code>public/</code> do seu projeto
            </li>
            <li>A imagem já está configurada no layout.tsx para ser usada como preview</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
