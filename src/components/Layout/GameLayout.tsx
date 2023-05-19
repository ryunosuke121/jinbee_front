import { ReactElement, ReactNode } from "react"
import Head from "next/head"

export const metadata = {
  title: "AI",
  description: "AI",
}

type gameLayout = {
  children: ReactNode
  situation: string
}

const GameLayout = (props: gameLayout) => {
  const { children, situation } = props

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/*situationに応じて背景が変わる */}
        <div
          className="layout"
          style={{
            backgroundImage: `url(${situation})`,
          }}
        >
          {children}
        </div>
      </main>

      <style jsx>{`
        .layout {
          background-size: cover;
          background-position: center;
          height: 100vh;
        }
      `}</style>
    </>
  )
}

export default GameLayout
