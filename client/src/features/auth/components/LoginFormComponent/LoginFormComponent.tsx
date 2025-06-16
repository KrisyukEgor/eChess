import React, { type FormEvent, useState, type ChangeEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthInput from "../AuthInput/AuthInput";
import { useAuthContext } from "../../context/AuthContext";
import { RoutesEnum } from "../../../../shared/utils/RoutesEnum";
import styles from "./LoginFormComponent.module.css";

const LoginFormComponent: React.FC = () => {
  const { login, error: authError } = useAuthContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
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
    const newErrors: { email?: string; password?: string } = {};
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
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
    } catch (err) {
      if (err instanceof Error) {
        setErrors({ form: err.message });
      } else {
        setErrors({ form: "Ошибка при входе" });
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Войти в аккаунт</h2>

      {errors.form && <div className={styles.formError}>{errors.form}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
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
          Войти
        </button>

        <div className={styles.registerPrompt}>
          <span>Нет аккаунта?</span>
          <Link to={RoutesEnum.RegisterRoute} className={styles.registerLink}>
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginFormComponent;
