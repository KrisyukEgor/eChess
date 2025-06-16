import React, { type FormEvent, useState, type ChangeEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthInput from "../AuthInput/AuthInput";
import { useAuthContext } from "../../context/AuthContext";
import { RoutesEnum } from "../../../../shared/utils/RoutesEnum";
import styles from "./RegisterFormComponent.module.css";

const RegisterFormComponent: React.FC = () => {
  const { register, error: authError } = useAuthContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    userName?: string;
    form?: string;
  }>({});

  useEffect(() => {
    if (authError) {
      setErrors((prev) => ({ ...prev, form: authError }));
    }
  }, [authError]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, form: undefined }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string; userName?: string } =
      {};
    if (!formData.userName.trim()) {
      newErrors.userName = "Имя обязательно";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    }
    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    }
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      await register({
        userName: formData.userName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка при регистрации";
      setErrors({ form: msg });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Зарегистрировать аккаунт</h2>

      {errors.form && <div className={styles.formError}>{errors.form}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <AuthInput
          name="userName"
          placeholder="Nick name"
          value={formData.userName}
          onChange={handleChange}
          error={errors.userName || null}
        />
        <AuthInput
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email || null}
        />
        <AuthInput
          name="password"
          type="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          error={errors.password || null}
        />
        <button type="submit" className={styles.button}>
          Регистрация
        </button>
      </form>

      <div className={styles.redirectContainer}>
        <span className={styles.redirectText}>Уже есть аккаунт?</span>
        <Link to={RoutesEnum.LoginRoute} className={styles.redirectLink}>
          Войти
        </Link>
      </div>
    </div>
  );
};

export default RegisterFormComponent;
