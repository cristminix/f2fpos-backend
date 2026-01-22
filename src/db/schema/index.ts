// Import all schema definitions from separate files
// import { sessions } from "./sessions";
import { users } from "./users";
import { user_roles } from "./user_roles";
// import { posts } from "./posts";
import { outlets } from "./outlets";
import { product_categories } from "./product_categories";
import { user_info } from "./user_info";
import { app_roles } from "./app_roles";
// Export all schema definitions
export {
  // sessions,
  users,
  user_roles,
  // posts,
  outlets,
  product_categories,
  user_info,
  app_roles,
};

// Import and export all types
// import type { Session } from "./sessions";
import type { User } from "./users";
import type { UserRole } from "./user_roles";
import type { Post } from "./posts";
import type { Outlet } from "./outlets";
import type { ProductCategory } from "./product_categories";
import type { UserInfo } from "./user_info";
import type { AppRole } from "./app_roles";
export type {
  // Session,
  User,
  UserRole,
  Post,
  Outlet,
  ProductCategory,
  UserInfo,
  AppRole,
};
