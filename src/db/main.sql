/*
 Navicat Premium Dump SQL

 Source Server         : f2f-backend
 Source Server Type    : SQLite
 Source Server Version : 3045000 (3.45.0)
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3045000 (3.45.0)
 File Encoding         : 65001

 Date: 22/01/2026 22:08:03
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
INSERT INTO "_cf_METADATA" VALUES (2, '10');

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
