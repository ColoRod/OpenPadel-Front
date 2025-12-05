import LogoGrande from '../../components/atoms/LogoGrande/LogoGrande';
import RegisterForm from '../../components/molecules/RegisterForm/RegisterForm';
import './RegisterPage.scss';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-box">
        <h2 className="register-title">REGISTRARSE</h2>
        <LogoGrande />
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
