import LogoGrande from '../../components/atoms/LogoGrande/LogoGrande';
import LoginForm from '../../components/molecules/LoginForm/LoginForm';
import './LoginPage.scss';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">INICIAR SESIÓN</h2>
        <LogoGrande />
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
