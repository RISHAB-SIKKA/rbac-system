export interface User {
    id: string;
    email: string;
    password: string;
    created_at: Date;
  }
  
  export interface UserDTO {
    email: string;
    password: string;
  }
  
  export interface SafeUser {
    id: string;
    email: string;
  }

  export interface LoginResponse {
    user: SafeUser;
    accessToken: string;
  }