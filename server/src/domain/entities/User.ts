export class User {
  private id: string;
  private email: string;
  private userName: string;

  constructor(id: string, email: string, userName: string) {
    this.id = id;
    this.email = email;
    this.userName = userName;
  }

  public get Id(): string {
    return this.id;
  }

  public get Email(): string {
    return this.email;
  }

  public get UserName(): string {
    return this.userName;
  }
}
