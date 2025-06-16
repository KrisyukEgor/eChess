import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import { RoutesEnum } from "../../shared/utils/RoutesEnum";
import { useAuthContext } from "../../features/auth/context/AuthContext";

function HomePage() {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (!isAuthenticated) {
      navigate(RoutesEnum.LoginRoute);
    } else {
      navigate(RoutesEnum.InviteRoute);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Добро пожаловать в eChess</h1>
        <p className={styles.subtitle}>
          Играйте в шахматы онлайн с друзьями или случайными соперниками
        </p>
        <button onClick={handlePlayClick} className={styles.playButton}>
          {isAuthenticated ? "Начать игру" : "Войти и играть"}
        </button>
      </section>

    </div>
  );
}

export default HomePage;
