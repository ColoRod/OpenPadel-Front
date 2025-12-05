import { useState, forwardRef } from "react";
import "./FileInput.scss";

const FileInput = forwardRef(({ label, onChange, ...props }, ref) => {
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");

  const handleLocalChange = (e) => {
    const file = e.target.files[0];

    if (file && !file.type.startsWith("image/")) {
      setFileName("Ningún archivo seleccionado");
    } else {
      setFileName(file ? file.name : "Ningún archivo seleccionado");
    }

    if (onChange) onChange(e);
  };

  return (
    <div className="file-input">
      {label && <label>{label}</label>}

      <div className="file-wrapper">
        <input 
          type="file" 
          id="fileUpload" 
          onChange={handleLocalChange}
          ref={ref} 
          {...props}
        />

        <label htmlFor="fileUpload" className="file-btn">
          Seleccionar archivo
        </label>

        <span className="file-name">{fileName}</span>
      </div>
    </div>
  );
});

export default FileInput;
