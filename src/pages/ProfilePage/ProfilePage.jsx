import { useState, useEffect, useRef } from "react";
import HeaderPerfil from "../../components/molecules/HeaderPerfil/HeaderPerfil";
import "./ProfilePage.scss";

const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("*******");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [genero, setGenero] = useState("");
  const [categoria, setCategoria] = useState("");

  const [tempNombre, setTempNombre] = useState("");
  const [tempApellido, setTempApellido] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [tempTelefono, setTempTelefono] = useState("");
  const [tempCategoria, setTempCategoria] = useState("");

  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const categoryRef = useRef();

    const categoriasMasculino = [
  "7ma caballero", "6ta caballero", "5ta caballero",
  "4ta caballero", "3ra caballero", "2da caballero", "1ra caballero"
];

const categoriasFemenino = [
  "7ma dama", "6ta dama", "5ta dama",
  "4ta dama", "3ra dama", "2da dama", "1ra dama"
];

  // 👉 Obtener perfil real
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setNombre(data.nombre);
      setApellido(data.apellido);
      setEmail(data.email);
      setTelefono(data.telefono);
      setDni(data.dni);
      setCategoria(data.categoria);

      const gen = data.categoria.toLowerCase().includes("dama") ? "femenino" : "masculino";
      setGenero(gen);

      if (data.foto_url) {
        setPhotoUrl(`${API_URL.replace("/api", "")}/uploads/${data.foto_url}`);
      }
    };

    load();
   
  }, []);

  // 👉 Guardar cambios en backend
  const updateProfile = async (changes) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let bodyToSend;

    if (changes.foto) {
      // si viene foto → FormData
      bodyToSend = new FormData();
      Object.keys(changes).forEach((key) =>
        bodyToSend.append(key, changes[key])
      );
    } else {
      bodyToSend = JSON.stringify(changes);
    }

    await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: changes.foto
        ? { Authorization: `Bearer ${token}` }
        : {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      body: bodyToSend,
    });
  };

  // 👉 Cambiar imagen localmente (solo vista)
 const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoUrl(URL.createObjectURL(file));

    updateProfile({ foto: file });
  };

  // 👉 Cancelar edición con click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingName && nameRef.current && !nameRef.current.contains(e.target)) {
        setTempNombre(nombre);
        setTempApellido(apellido);
        setEditingName(false);
      }

      if (editingEmail && emailRef.current && !emailRef.current.contains(e.target)) {
        setTempEmail(email);
        setEditingEmail(false);
      }

      if (editingPassword && passwordRef.current && !passwordRef.current.contains(e.target)) {
        setTempPassword(password);
        setEditingPassword(false);
      }

      if (editingPhone && phoneRef.current && !phoneRef.current.contains(e.target)) {
        setTempTelefono(telefono);
        setEditingPhone(false);
      }

      if (editingCategory && categoryRef.current && !categoryRef.current.contains(e.target)) {
        setTempCategoria(categoria);
        setEditingCategory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <>
      <HeaderPerfil />

      <div className="profile-container"> {/* FOTO + NOMBRE */}
         <div className="profile-header-inline"> <label className="photo-wrapper">
           <img src={photoUrl} alt="user" className="profile-photo" />
            <input type="file" accept="image/*" onChange={handleImageChange} /> 
            </label> <div className="profile-name" ref={nameRef}>
               {editingName ? ( <div className="edit-wrapper">
                 <input className="input-edit" 
                 value={tempNombre} onChange={(e) => setTempNombre(e.target.value)}
                  placeholder="Nombre" autoFocus /> 
                  <input className="input-edit" value={tempApellido} 
                  onChange={(e) => setTempApellido(e.target.value)} placeholder="Apellido" />
                   <button className="btn-save" onClick={() =>
                     { setNombre(tempNombre); setApellido(tempApellido); 
                     updateProfile({ nombre: tempNombre, apellido: tempApellido }); 
                     setEditingName(false); }
                     } > Guardar </button>
                      </div> ) : ( <>
                       <span>{nombre} {apellido}</span>
                        <span className="edit-icon-name"
                         onClick={() => 
                         { setTempNombre(nombre);
                          setTempApellido(apellido);
                           setEditingName(true); }} 
                           > ✏️ </span> </> )}
                            </div> 
                            </div>

        <h2 className="section-title">DATOS</h2>

        {/* EMAIL */}
        <div className="profile-field" ref={emailRef}>
          <label>Correo</label>
          {editingEmail ? (
            <div className="edit-wrapper">
              <input
                className="input-edit"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                autoFocus
              />
              <button
                className="btn-save"
                onClick={() => {
                  setEmail(tempEmail);
                  updateProfile({ email: tempEmail });
                  setEditingEmail(false);
                }}
              >
                Guardar
              </button>
            </div>
          ) : (
            <div className="input-display">
              <input className="input-disabled" value={email} disabled />
              <span
  className="edit-icon"
  onClick={() => {
    setTempEmail(email);
    setEditingEmail(true);
  }}
>
  ✏️
</span>
            </div>
          )}
        </div>

         {/* PASSWORD */}
        <div className="profile-field" ref={passwordRef}>
          <label>Contraseña</label>
          {editingPassword ? (
            <div className="edit-wrapper">
              <div className="password-input-container">
                <input
                  className="input-edit"
                  type={showPassword ? "text" : "password"}
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  autoFocus
                />

                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              <button
                className="btn-save"
                onClick={() => {
                  setPassword(tempPassword);
                  updateProfile({ password: tempPassword });
                  setEditingPassword(false);
                }}
              >
                Guardar
              </button>
            </div>
          ) : (
            <div className="input-display">
              <input className="input-disabled" type="password" value={password} disabled />
              <span className="edit-icon" onClick={() => setEditingPassword(true)}>✏️</span>
            </div>
          )}
        </div>

        {/* TELÉFONO */}
        <div className="profile-field" ref={phoneRef}>
          <label>Teléfono</label>
          {editingPhone ? (
            <div className="edit-wrapper">
              <input
                className="input-edit"
                value={tempTelefono}
                onChange={(e) => setTempTelefono(e.target.value)}
                autoFocus
              />

              <button
                className="btn-save"
                onClick={() => {
                  setTelefono(tempTelefono);
                  updateProfile({ telefono: tempTelefono });
                  setEditingPhone(false);
                }}
              >
                Guardar
              </button>
            </div>
          ) : (
            <div className="input-display">
              <input className="input-disabled" value={telefono} disabled />
              <span
  className="edit-icon"
  onClick={() => {
    setTempTelefono(telefono);
    setEditingPhone(true);
  }}
>
  ✏️
</span>
            </div>
          )}
        </div>

        {/* DNI (NO EDITABLE) */}
        <div className="profile-field">
          <div className="dni-input">
          <label>DNI</label>
          <div className="input-display">
            <input className="input-disabled" value={dni} disabled />
            </div>
          </div>
        </div>

        {/* CATEGORY */}

        <div className="profile-field" ref={categoryRef}>
          <label>Categoría</label>

          {editingCategory ? (
            <div className="edit-wrapper">
              <select
  className="select-custom"
  value={tempCategoria}
  onChange={(e) => setTempCategoria(e.target.value)}
  autoFocus
>
  {(genero === "masculino"
    ? categoriasMasculino
    : categoriasFemenino
  ).map((cat) => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
              <button
                className="btn-save"
                onClick={() => {
                  setCategoria(tempCategoria);
                  updateProfile({ categoria: tempCategoria });
                  setEditingCategory(false);
                }}
              >
                Guardar
              </button>
            </div>

          ) : (
            <div className="input-display">
              <input className="input-disabled" value={categoria} disabled />
              <span className="edit-icon" onClick={() => setEditingCategory(true)}>✏️</span>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ProfilePage;

