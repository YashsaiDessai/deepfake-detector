import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

// Auth Context
export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('realio_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('realio_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('realio_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/dashboard" /> : <Signup />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App