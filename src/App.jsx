import { BrowserRouter, Routes, Route } from "react-router-dom"
import ChangeIcon from "./hooks/ChangeIcon"
import Home from "./routes/Home";

const App = () => {

  ChangeIcon();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={''} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
