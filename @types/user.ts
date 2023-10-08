export namespace NSUser {
  export enum Type {
    kid = "kid",
    adult = "adult",
    teen = "teen",
    admin = "admin",
  }

  export interface Item {
    id: string;
    fullName: string;
    email: string;
    password: string;
    // ?: string;
    description?: string;
    type?: Type;
    DOB: Date;
    // createdAt: Date;
  }

  export interface Role {
    id: number;
    name: string;
    permissions: number[];
  }

  export interface Permission {
    id: number;
    name: string;
  }
}
