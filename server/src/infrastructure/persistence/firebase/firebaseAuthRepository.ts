
import { IAuthRepository } from "../../../domain/repositories/IAuthRepository";
import { User } from "../../../domain/entities/User";
import { fireStore, auth } from "./firebaseAdmin";
import axios from "axios";
import { PasswordService } from "../../services/PasswordService";

export class FirebaseAuthRepository implements IAuthRepository {
  private readonly FIREBASE_API_KEY: string;

  constructor(apiKey: string) {
    this.FIREBASE_API_KEY = apiKey;
  }

  async register( email: string, password: string, userName: string): Promise<{ user: User; token: string }> {
    try {
      const querySnapshot = await fireStore
        .collection("profiles")
        .where("userName", "==", userName)
        .get();

      if (!querySnapshot.empty) {
        throw new Error("Имя пользователя уже занято");
      }
    } 
    catch (e: any) {
      if (e.message === "Имя пользователя уже занято") {
        throw e;
      }
      console.error("Ошибка при проверке уникальности userName:", e);
      throw new Error("Не удалось проверить имя пользователя");
    }

    let userRecord;

    try {
      userRecord = await auth.createUser({ email, password });
    } 
    catch (e: any) {
      if (e.code === "auth/email-already-exists") {
        throw new Error("Этот email уже зарегистрирован");
      }
      if (e.code === "auth/invalid-password") {
        throw new Error("Пароль должен быть не менее 6 символов");
      }
      throw new Error("Не удалось создать пользователя");
    }

    try {
      await auth.updateUser(userRecord.uid, { displayName: userName });
    } catch (e) {
      console.error("Не удалось обновить displayName в Auth:", e);
    }

    try {
      const hashedPassword = await PasswordService.hashPassword(password);
      await fireStore.collection("profiles").doc(userRecord.uid).set({
        userName,
        email,
        createdAt: new Date(),
        hashedPassword,
      });
    } catch (e) {
      console.error("Не удалось сохранить профиль в Firestore:", e);
    }

    let idToken: string;
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.FIREBASE_API_KEY}`;
      const { data } = await axios.post<{
        idToken: string;
        refreshToken: string;
        expiresIn: string;
        localId: string;
        email: string;
        displayName?: string;
      }>(url, {
        email,
        password,
        returnSecureToken: true,
      });
      idToken = data.idToken;
    } catch (e: any) {
      console.warn(
        "Регистрация прошла, но не удалось залогинить автоматически:",
        e.response?.data || e
      );
      throw new Error("Ошибка при получении токена после регистрации");
    }

    return {
      user: new User(userRecord.uid, userRecord.email!, userName),
      token: idToken,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    let idToken: string;
    let localId: string;
    let emailFromResponse: string;

    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.FIREBASE_API_KEY}`;
      const { data } = await axios
        .post<{
          idToken: string;
          refreshToken: string;
          expiresIn: string;
          localId: string;
          email: string;
          displayName?: string;
        }>(url, {
          email,
          password,
          returnSecureToken: true,
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response.data?.error?.message;
            console.error("Firebase Auth Error:", errorMessage);

            switch (errorMessage) {
              case "EMAIL_NOT_FOUND":
                throw new Error("Пользователь с таким email не найден");
              case "INVALID_PASSWORD":
                throw new Error("Неверный пароль");
              case "USER_DISABLED":
                throw new Error("Аккаунт отключен");
              default:
                throw new Error("Ошибка при входе в систему");
            }
          }
          throw error;
        });

      idToken = data.idToken;
      localId = data.localId;
      emailFromResponse = data.email;

      const doc = await fireStore.collection("profiles").doc(localId).get();
      let userName = "";

      if (doc.exists) {
        const profileData = doc.data();
        userName = (profileData?.userName as string) || "";
      } else {
        console.warn(`Profile document not found for user ${localId}`);
      }

      return {
        user: new User(localId, emailFromResponse, userName),
        token: idToken,
      };
    } catch (error: any) {
      console.error("Login error:", error.message);
      if (error.message.includes("Firebase Auth Error")) {
        throw error;
      }
      throw new Error("Ошибка при входе в систему");
    }
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return new User(
        decodedToken.uid,
        decodedToken.email ?? "",
        decodedToken.name ?? ""
      );
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
