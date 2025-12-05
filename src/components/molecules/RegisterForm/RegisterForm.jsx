import { useState, useRef } from "react";
import Input from "../../atoms/Input/Input";
import PasswordInput from "../../atoms/PasswordInput/PasswordInput";
import ButtonModule from "../../atoms/ButtonModule/ButtonModule";
import FileInput from "../../atoms/FileInput/FileInput";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.scss";

const API_URL = import.meta.env.VITE_API_URL;

const RegisterForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    dni: "",
    password: "",
    telefono: "",
    genero: "",
    categoria: "",
  });

  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
  const { name, value } = e.target;

  // Validación para que 'nombre' y 'apellido' solo contengan letras
  if ((name === "nombre" || name === "apellido") && /[^a-zA-ZÀ-ÿ\s]/.test(value)) {
    return; // No actualiza el valor si contiene números u otros caracteres no permitidos
  }

  // Validación para que 'dni' y 'telefono' solo contengan números
  if ((name === "dni" || name === "telefono") && /[^0-9]/.test(value)) {
    return; // No actualiza el valor si contiene letras
  }

  if (name === "genero") {
      setForm({ ...form, genero: value, categoria: "" }); 
      return;
    }

  // Actualiza el estado de forma general para cualquier campo
  setForm({ ...form, [name]: value });
};

  const handleFile = (e) => {
  const file = e.target.files[0];

  // Asegúrate de que sea una imagen
  if (file && !file.type.startsWith("image/")) {
    alert("Solo se permiten imágenes (jpg, png, etc.)");
    e.target.value = ""; // Resetea el input
    setFoto(null);  // Resetea la foto en el estado
    setPreview(null); // Resetea la vista previa
    return;
  }

  // Si el archivo es válido, establece el estado de foto
  setFoto(file);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
};

  const fileInputRef = useRef(null);
  const removePhoto = () => {
    setFoto(null);
    setPreview(null);

     if (fileInputRef.current) {
    fileInputRef.current.value = "";

    fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
  }

  };

 const handleRegister = async (e) => {
  e.preventDefault();

  ///PARA PRUEBA
  console.log(form);

  // Verifica que todos los campos estén completos
  if (!form.nombre || !form.apellido || !form.email || !form.password || !form.dni || !form.telefono || !form.categoria) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  // Validación del nombre y apellido (solo letras y espacios)
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(form.nombre)) {
    alert("El nombre solo puede contener letras.");
    return;
  }

  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(form.apellido)) {
    alert("El apellido solo puede contener letras.");
    return;
  }

  // DNI exacto 8 dígitos
    if (form.dni.length !== 8) {
      alert("El DNI debe tener exactamente 8 números.");
      return;
    }

 // Teléfono entre 10 y 11 dígitos
    if (form.telefono.length !== 10 && form.telefono.length !== 11) {
      alert("El teléfono debe tener entre 10 y 11 números.");
      return;
    }

  // Verifica si se subió una foto
  if (!foto) {
    alert("Debes subir una foto.");
    return;
  }

  // Formato de envío de datos al servidor
  const data = new FormData();
  data.append("nombre", form.nombre);
  data.append("apellido", form.apellido);
  data.append("email", form.email);
  data.append("password", form.password);
  data.append("dni", form.dni);
  data.append("telefono", form.telefono);
  data.append("genero", form.genero);
  data.append("categoria", form.categoria);
  data.append("foto", foto);  // Agrega la foto si está presente

 try {
const API_BASE = import.meta.env.VITE_API_URL || "";

const res = await fetch(`${API_BASE}/auth/register`, {
method: "POST",
body: data, // FormData
});

const json = await res.json();

if (!res.ok) {
alert(json.error || json.message || "Error en el registro");
return;
}

alert("Usuario registrado con éxito");
navigate("/");

} catch (err) {
console.error("Error en registro:", err);
alert("Error con el servidor");
}
};

const categoriasMasculino = [
    "7ma caballero",
    "6ta caballero",
    "5ta caballero",
    "4ta caballero",
    "3ra caballero",
    "2da caballero",
    "1ra caballero"
  ];

  const categoriasFemenino = [
    "7ma dama",
    "6ta dama",
    "5ta dama",
    "4ta dama",
    "3ra dama",
    "2da dama",
    "1ra dama"
  ];

  return (
    <form className="register-form" onSubmit={handleRegister}>
      <div className="form-content">
      <Input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={form.apellido}
        onChange={handleChange}
        required
      />

      <Input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <Input
        type="email"
        name="email"
        placeholder="Correo"
        value={form.email}
        onChange={handleChange}
        required
      />

      <Input
        type="text"
        name="dni"
        placeholder="DNI"
        value={form.dni}
        onChange={handleChange}
        required
      />

      <PasswordInput
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        required
      />

      <Input
        type="tel"
        name="telefono"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
        required
      />

       {/* SELECT de género */}
       <select name="genero" value={form.genero} onChange={handleChange} className="input" required>
          <option value="">Seleccione género</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>

      {/* SELECT de categoría */}
      <select
        name="categoria"
        value={form.categoria}
        onChange={handleChange}
        className="input"   // tu estilo (mismo que los inputs)
        disabled={!form.genero}
        required
      >
        <option value="">Seleccione su categoría</option> {/* Opción que obliga a elegir */}
       {form.genero === "masculino" &&
            categoriasMasculino.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}

          {form.genero === "femenino" &&
            categoriasFemenino.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
      </select>

      <FileInput
        label="Foto"
        name="foto"
        onChange={handleFile}
        ref={fileInputRef}
      />
            
      {preview && (
          <div className="preview-box">
            <img src={preview} alt="preview" />
            <button type="button" className="remove-photo" onClick={removePhoto}>
              Quitar foto
            </button>
          </div>
      )}

      <ButtonModule
        text="Registrarse"
        color="primary"
        type="submit"
      />
      </div>
    </form>
  );
};

export default RegisterForm;