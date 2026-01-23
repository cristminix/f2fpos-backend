// Import all schema definitions from separate files
// import { sessions } from "./sessions";
import { users } from "./users";
import { user_roles } from "./user_roles";
// import { posts } from "./posts";
import { outlets } from "./outlets";
import { product_categories } from "./product_categories";
import { user_info } from "./user_info";
import { app_roles } from "./app_roles";
import { ingredients } from "./ingredients";
import { products } from "./products";
import { stock_inventory } from "./stock_inventory";
import { file_uploads } from "./file_uploads";
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
  ingredients,
  products,
  stock_inventory,
  file_uploads,
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
import type { Product } from "./products";
import type { StockInventory } from "./stock_inventory";
import type { FileUpload } from "./file_uploads";
export type {
  // Session,
  User,
  UserRole,
  Post,
  Outlet,
  ProductCategory,
  UserInfo,
  AppRole,
  Product,
  StockInventory,
  FileUpload,
};
