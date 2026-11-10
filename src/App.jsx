import { BrowserRouter, Routes, Route } from "react-router-dom"
import ChangeIcon from "./hooks/ChangeIcon"
import Home from "./routes/Home";
import Login from "./routes/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {

  ChangeIcon();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={''} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />} >
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
