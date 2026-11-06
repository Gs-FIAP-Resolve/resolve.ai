import { BrowserRouter, Routes, Route } from "react-router-dom"
import ChangeIcon from "./hooks/ChangeIcon"

const App = () => {

  ChangeIcon();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={''}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
