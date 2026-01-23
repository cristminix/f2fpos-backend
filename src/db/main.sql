/*
 Navicat Premium Dump SQL

 Source Server         : f2f-backend
 Source Server Type    : SQLite
 Source Server Version : 3045000 (3.45.0)
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3045000 (3.45.0)
 File Encoding         : 65001

 Date: 23/01/2026 17:50:36
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for _cf_METADATA
-- ----------------------------
DROP TABLE IF EXISTS "_cf_METADATA";
CREATE TABLE "_cf_METADATA" (
  "key" INTEGER,
  "value" BLOB,
  PRIMARY KEY ("key")
);

-- ----------------------------
-- Records of _cf_METADATA
-- ----------------------------
INSERT INTO "_cf_METADATA" VALUES (2, '481');

-- ----------------------------
-- Table structure for app_roles
-- ----------------------------
DROP TABLE IF EXISTS "app_roles";
CREATE TABLE "app_roles" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" text(256) NOT NULL,
  "roleType" text(256),
  "enabled" integer DEFAULT true,
  "path" text(512),
  "contents" text,
  "description" text(512),
  "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of app_roles
-- ----------------------------

-- ----------------------------
-- Table structure for file_uploads
-- ----------------------------
DROP TABLE IF EXISTS "file_uploads";
CREATE TABLE "file_uploads" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "fileName" text,
  "size" integer NOT NULL,
  "mimeType" text NOT NULL,
  "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of file_uploads
-- ----------------------------

-- ----------------------------
-- Table structure for ingredients
-- ----------------------------
DROP TABLE IF EXISTS "ingredients";
CREATE TABLE "ingredients" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "outletId" integer NOT NULL,
  "name" text(256) NOT NULL,
  "code" text(150) NOT NULL,
  "description" text(500) NOT NULL,
  "unit" text(50) NOT NULL,
  "alternateUnit" text(50) NOT NULL,
  "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of ingredients
-- ----------------------------
INSERT INTO "ingredients" VALUES (1, 1, 'Hello', 'B', '', 'Ml', '', '1769155902534.0');
INSERT INTO "ingredients" VALUES (2, 1, 'Olahraga', '', '', 'Liter', '', '1769155936172.0');
INSERT INTO "ingredients" VALUES (3, 1, 'Kepompong', 'KPP', '', 'Buah', 'Ekor', '1769162618545.0');
INSERT INTO "ingredients" VALUES (4, 1, 'Sarang Burung Walet', 'SR00', '', 'Buah', 'Ikat', '1769162811567.0');

-- ----------------------------
-- Table structure for outlets
-- ----------------------------
DROP TABLE IF EXISTS "outlets";
CREATE TABLE "outlets" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "userId" integer NOT NULL,
  "name" text(256) NOT NULL,
  "address" text(512) NOT NULL,
  "businessType" text(100) NOT NULL,
  "logo" text(512),
  "tax" integer DEFAULT 0,
  "settings" text NOT NULL,
  "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of outlets
-- ----------------------------
INSERT INTO "outlets" VALUES (1, 1, 'F2F Mart', 'Jln Kehidupan No. 666', 'retail', 'no-logo', 0, '{"enablePayment":false}', '2026-01-22 17:54:10');
INSERT INTO "outlets" VALUES (2, 1, 'F2F Loandry', 'Jln KH Abdurrahman', 'retail', 'no-logo', 0, '{}', '123456');

-- ----------------------------
-- Table structure for product_category
-- ----------------------------
DROP TABLE IF EXISTS "product_category";
CREATE TABLE "product_category" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "outletId" integer NOT NULL,
  "name" text(256) NOT NULL,
  "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of product_category
-- ----------------------------
INSERT INTO "product_category" VALUES (1, 1, 'Elektronik', '2026-01-22 17:54:10');
INSERT INTO "product_category" VALUES (2, 1, 'Pakaian', '2026-01-22 17:55:16');
INSERT INTO "product_category" VALUES (3, 1, 'Makanan & Minuman', '2026-01-22 17:55:16');
INSERT INTO "product_category" VALUES (4, 1, 'Kesehatan & Kecantikan', '2026-01-22 17:55:16');
INSERT INTO "product_category" VALUES (6, 1, 'Rumah Tangga', '2026-01-22 17:55:16');
INSERT INTO "product_category" VALUES (8, 1, 'Buku & Alat Tulis', '2026-01-22 17:55:17');
INSERT INTO "product_category" VALUES (10, 1, 'Perhiasan & Aksesori', '2026-01-22 17:55:17');
INSERT INTO "product_category" VALUES (14, 1, 'Hello', '2026-01-23 05:49:12');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS "products";
CREATE TABLE "products" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "outletId" integer NOT NULL,
  "name" text(256) NOT NULL,
  "code" text(150) NOT NULL,
  "description" text(500) NOT NULL,
  "unit" text(50) NOT NULL,
  "alternateUnit" text(50) NOT NULL,
  "image" text,
  "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of products
-- ----------------------------

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE "sqlite_sequence" (
  "name",
  "seq"
);

-- ----------------------------
-- Records of sqlite_sequence
-- ----------------------------
INSERT INTO "sqlite_sequence" VALUES ('users', 2);
INSERT INTO "sqlite_sequence" VALUES ('user_roles', 2);
INSERT INTO "sqlite_sequence" VALUES ('user_info', 2);
INSERT INTO "sqlite_sequence" VALUES ('outlets', 2);
INSERT INTO "sqlite_sequence" VALUES ('product_category', 14);
INSERT INTO "sqlite_sequence" VALUES ('ingredients', 4);
INSERT INTO "sqlite_sequence" VALUES ('stock_inventory', 4);

-- ----------------------------
-- Table structure for stock_inventory
-- ----------------------------
DROP TABLE IF EXISTS "stock_inventory";
CREATE TABLE "stock_inventory" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "outletId" integer NOT NULL,
  "itemId" integer NOT NULL,
  "itemType" text NOT NULL,
  "minQty" integer NOT NULL DEFAULT 0,
  "qty" integer NOT NULL DEFAULT 0,
  "notes" text,
  "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of stock_inventory
-- ----------------------------
INSERT INTO "stock_inventory" VALUES (1, 1, 1, 'ingredient', 10, 10, NULL, '12345');
INSERT INTO "stock_inventory" VALUES (2, 1, 2, 'ingredient', 100, 98, NULL, '123456');
INSERT INTO "stock_inventory" VALUES (3, 1, 3, 'ingredient', 80, 80, NULL, '111111');
INSERT INTO "stock_inventory" VALUES (4, 1, 4, 'ingredient', 8, 8, '', '1769162811607.0');

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS "user_info";
CREATE TABLE "user_info" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "userId" integer NOT NULL,
  "avatar" text,
  "displayName" text(50),
  "googleId" text,
  "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO "user_info" VALUES (1, 1, 'https://i.pinimg.com/736x/c0/5b/a5/c05ba59a93d4e7ca51cafd2575a21b84.jpg', 'Lalisa Mano', NULL, '1769094421922');
INSERT INTO "user_info" VALUES (2, 2, 'https://i1.sndcdn.com/artworks-000062209624-mvitec-t500x500.jpg', 'John Lenon', NULL, '1769094422062');

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS "user_roles";
CREATE TABLE "user_roles" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "userId" integer NOT NULL,
  "roles" text(256) NOT NULL,
  "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO "user_roles" VALUES (1, 1, '["group:owner"]', '1769094421922');
INSERT INTO "user_roles" VALUES (2, 2, '["group:admin"]', '1769094422062');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" text(256) NOT NULL,
  "email" text(256) NOT NULL,
  "password" text(256) NOT NULL,
  "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "users" VALUES (1, 'demo', 'demo@example.com', 'df1fda6bc141315928303adfdf0880df', '1769094421922');
INSERT INTO "users" VALUES (2, 'admin', 'admin@example.com', 'f19aa49ccc5f7f8528647f9951002dce', '1769094422062');

-- ----------------------------
-- Auto increment value for ingredients
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 4 WHERE name = 'ingredients';

-- ----------------------------
-- Auto increment value for outlets
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 2 WHERE name = 'outlets';

-- ----------------------------
-- Auto increment value for product_category
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 14 WHERE name = 'product_category';

-- ----------------------------
-- Auto increment value for stock_inventory
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 4 WHERE name = 'stock_inventory';

-- ----------------------------
-- Auto increment value for user_info
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 2 WHERE name = 'user_info';

-- ----------------------------
-- Auto increment value for user_roles
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 2 WHERE name = 'user_roles';

-- ----------------------------
-- Auto increment value for users
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 2 WHERE name = 'users';

-- ----------------------------
-- Indexes structure for table users
-- ----------------------------
CREATE UNIQUE INDEX "users_email_unique"
ON "users" (
  "email" ASC
);
CREATE UNIQUE INDEX "users_username_unique"
ON "users" (
  "username" ASC
);

PRAGMA foreign_keys = true;
