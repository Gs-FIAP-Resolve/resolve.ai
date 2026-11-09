import { BrowserRouter, Routes, Route } from "react-router-dom"
import ChangeIcon from "./hooks/ChangeIcon"
import Home from "./routes/Home";
import Login from "./routes/Login";

const App = () => {

  ChangeIcon();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={''} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
