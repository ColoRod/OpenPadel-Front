import './ButtonModule.scss';

const ButtonModule = ({ text, color, onClick, type = "button" }) => {
  return (
    <button 
      className={`btn ${color}`} 
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
};

export default ButtonModule;
