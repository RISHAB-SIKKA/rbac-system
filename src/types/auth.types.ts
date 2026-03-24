export interface JwtPayload {
    sub: string; // subject (userId)
   iat?: number;
   exp?: number;
 }

 