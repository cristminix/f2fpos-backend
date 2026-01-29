// Import all schema definitions from separate files
import { sessions } from "./sessions"
import { users } from "./users"
import { user_roles } from "./user_roles"
import { posts } from "./posts"
import { outlets } from "./outlets"
import { product_categories } from "./product_categories"
import { user_info } from "./user_info"
import { members } from "./members"
import { memberships } from "./memberships"
import { memberAddresses } from "./member_addresses"
import { memberBankAccounts } from "./member_bank_accounts"
import { memberIdentities } from "./member_identities"
import { orders } from "./orders"
import { products } from "./products"
import { orderItems } from "./order_items"
import { shippings } from "./shippings"
import { shippingAddresses } from "./shipping_addresses"
import { paymentTransactions } from "./payment_transactions"
import { productStocks } from "./product_stocks"
import { productCategoryProducts } from "./product_category_products"
import { productImages } from "./product_images"
// Export all schema definitions
export {
  sessions,
  users,
  user_roles,
  posts,
  outlets,
  product_categories,
  user_info,
  members,
  memberships,
  memberAddresses,
  memberBankAccounts,
  memberIdentities,
  orders,
  products,
  orderItems,
  shippings,
  shippingAddresses,
  paymentTransactions,
  productStocks,
  productCategoryProducts,
  productImages,
}

// Import and export all types
import type { Session } from "./sessions"
import type { User } from "./users"
import type { UserRole } from "./user_roles"
import type { Post } from "./posts"
import type { Outlet } from "./outlets"
import type { ProductCategory } from "./product_categories"
import type { UserInfo } from "./user_info"
import type { Member } from "./members"
import type { Membership } from "./memberships"
import type { MemberAddress } from "./member_addresses"
import type { MemberBankAccount } from "./member_bank_accounts"
import type { MemberIdentity } from "./member_identities"
import type { Order } from "./orders"
import type { Product } from "./products"
import type { OrderItem } from "./order_items"
import type { Shipping } from "./shippings"
import type { ShippingAddress } from "./shipping_addresses"
import type { PaymentTransaction } from "./payment_transactions"
import type { ProductStock } from "./product_stocks"
import type { ProductCategoryProduct } from "./product_category_products"
import type { ProductImage } from "./product_images"
export type {
  Session,
  User,
  UserRole,
  Post,
  Outlet,
  ProductCategory,
  UserInfo,
  Member,
  Membership,
  MemberAddress,
  MemberBankAccount,
  MemberIdentity,
  Order,
  Product,
  OrderItem,
  Shipping,
  ShippingAddress,
  PaymentTransaction,
  ProductStock,
  ProductCategoryProduct,
  ProductImage,
}
