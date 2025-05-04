import { useState } from 'react';
import Header from './components/header/Header.jsx';
import Footer from './components/footer/Footer.jsx';
import Home from './components/home/Home.jsx';
import NotFound from './components/notFound/NotFound.jsx';
import RegisterPage from './components/auth/register/RegisterPage.jsx';
import LoginPage from './components/auth/login/LoginPage.jsx';
import StartGames from './components/startGames/StartGames.jsx';
import GameRoom from './components/gameRoom/GameRoom.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/constants';
import { logoutUser } from './services/User';
import { loginUser } from './services/User';
import { registerUser } from './services/User';
import { closeSocket } from './services/Socket';
import './App.css';

const App = () => {
  const [user, setUser] = useState(localStorage.getItem('user'))

  const handleLogout = () => {
    closeSocket(); // Cerrar cualquier conexión de socket al cerrar sesión
    setUser(null);
    localStorage.removeItem('user');
    logoutUser();
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home user={user} />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage registerUser={registerUser} />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage setUser={setUser} loginUser={loginUser} />} />
        <Route path={ROUTES.GAMES} element={<StartGames user={user} />} />
        <Route path="/game/:gameId" element={<GameRoom user={user} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;