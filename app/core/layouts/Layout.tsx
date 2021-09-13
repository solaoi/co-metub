import { ReactNode } from "react"
import { Head } from "blitz"
import Header from "./Header"
import Footer from "./Footer"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "co-metub"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ minHeight: "calc(100vh - 50px)" }}>
        <Header />
        {children}
      </div>
      <Footer />
    </>
  )
}

export default Layout
