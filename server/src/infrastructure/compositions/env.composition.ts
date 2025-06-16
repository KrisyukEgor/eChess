import dotenv from "dotenv";

dotenv.config();

export class EnvComposition {
  private static get(key: string): string | undefined {
    const value = process.env[key];
    return value;
  }

  static get FirebaseApiKey(): string {
    const apiKey = this.get("FIREBASE_API_KEY");

    if (!apiKey) {
      throw new Error("Cannot find firebaseApiKey");
    }

    return apiKey;
  }

  static get Port(): string {
    let port = this.get("PORT");

    if (!port) {
      port = "3000";
    }

    return port;
  }

  static get LichessApiKey(): string {
    const apiKey = this.get("LICHESS_API_KEY");

    if (!apiKey) {
      throw new Error("Cannot find Lichess API key");
    }

    return apiKey;
  }
}
