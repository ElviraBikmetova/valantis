import { ProductList } from "./components/products/Products";
import s from './App.module.scss'

function App() {

  return (
    <div className={s.container}>
      <ProductList/>
    </div>
  );
}

export default App;
