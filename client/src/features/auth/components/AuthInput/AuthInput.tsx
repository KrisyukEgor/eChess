import React, { type ChangeEvent } from "react";
import styles from "./AuthInput.module.css";

interface AuthInputProps {
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
}

const AuthInput: React.FC<AuthInputProps> = ({
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  error = null,
}) => {
  return (
    <div className={styles.wrapper}>
      <input
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
};

export default AuthInput;
