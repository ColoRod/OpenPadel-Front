import profileImg from "../../../assets/img/profile.jpg";
import "./ProfileButton.scss";

const ProfileButton = () => {
  return (
    <button className="profile-btn">
      <img src={profileImg} alt="Perfil" />
    </button>
  );
};

export default ProfileButton;
