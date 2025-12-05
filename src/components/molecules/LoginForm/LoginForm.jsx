import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../atoms/Input/Input';
import ButtonModule from '../../atoms/ButtonModule/ButtonModule';
import PasswordInput from '../../atoms/PasswordInput/PasswordInput';
import './LoginForm.scss';

const API_URL = import.meta.env.VITE_API_URL;

const LoginForm = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleLogin = async () => {
 try {
const API_BASE = import.meta.env.VITE_API_URL || "";

const res = await fetch(`${API_BASE}/auth/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
email: correo,
password: contraseña
}),
});

const data = await res.json();

if (!res.ok) {
alert(data.error || data.message || "Credenciales incorrectas");
return;
}

// Guardar al usuario
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));
localStorage.setItem("categoria", data.user.rol || "jugador");

navigate("/home");

} catch (err) {
console.error("Error en login:", err);
alert("Error con el servidor");
}
  };

  return (
    <div className="login-form">

      <Input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      <PasswordInput
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
      />

      <ButtonModule
        text="Ingresar"
        color="primary"
        onClick={handleLogin}
      />

      <ButtonModule
        text="Registrarse"
        color="secondary"
        onClick={() => navigate('/register')}
      />

    </div>
  );
};

export default LoginForm;
