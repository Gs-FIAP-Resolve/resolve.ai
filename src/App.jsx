import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ChangeIcon from "./hooks/ChangeIcon"
import Home from "./routes/Home";
import Login from "./routes/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Chat from "./routes/Chat";

const App = () => {

  ChangeIcon();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={''} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />} >
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Navigate to='/home' />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
