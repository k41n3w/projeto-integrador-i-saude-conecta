import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#0284c7", // Azul médico
        padding: "40px",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      {/* Cruz branca */}
      <div
        style={{
          position: "relative",
          width: "200px",
          height: "200px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "50px",
            height: "200px",
            backgroundColor: "white",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "0",
            transform: "translateY(-50%)",
            width: "200px",
            height: "50px",
            backgroundColor: "white",
          }}
        />
      </div>

      <h1
        style={{
          fontSize: "60px",
          fontWeight: "bold",
          textAlign: "center",
          margin: "0",
          marginBottom: "20px",
        }}
      >
        SaúdeConecta
      </h1>

      <p
        style={{
          fontSize: "30px",
          textAlign: "center",
          margin: "0",
          marginBottom: "20px",
        }}
      >
        Saúde Acessível Para Todos
      </p>

      <p
        style={{
          fontSize: "24px",
          textAlign: "center",
          margin: "0",
        }}
      >
        Conectando pacientes com serviços médicos gratuitos e de baixo custo
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
