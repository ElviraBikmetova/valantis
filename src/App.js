import { Header } from "./components/header/Header"
import { Products } from "./components/products/Products"
import { Footer } from "./components/footer/Footer"
import './styles.scss'

function App() {

  return (
    <>
      <Header />
      <main>
        <Products />
      </main>
      <Footer />
    </>
  )
}

export default App;
