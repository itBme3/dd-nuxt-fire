export interface UserDoc {
      uid: string;
      name: string;
      avatar: string;
      email?: string;
      phone?: string;
}
export enum UserRole {
      ADMIN = 'admin',
      EDITOR = 'editor',
      USER = 'user',
}
export const userRoles: UserRole[] = Object.values(UserRole);

export enum UserAccessType {
      PRODUCTS = 'products',
      IMAGES = 'images',
      REVIEWS = 'reviews',
      USERS = 'users'
}
export const userAccessTypes: UserAccessType[] = Object.values(UserAccessType);

export interface UserAccessDoc {
      uid: string;
      email?: string;
      phone?: string;
      access: UserAccessType[];
      role: UserRole;
}