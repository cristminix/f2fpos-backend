CREATE TABLE `member_addresses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`memberId` integer,
	`street` text,
	`subDistrict` text,
	`city` text,
	`province` text,
	`zipCode` text,
	`isPrimary` integer,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `member_bank_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`memberId` integer,
	`bankName` text,
	`bankCode` text,
	`accountNumber` text,
	`accountHolderName` text,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `member_identities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`memberId` integer,
	`idNumber` text,
	`photoUrl` text,
	`uploadedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fullName` text,
	`email` text,
	`phoneNumber` text,
	`password` text,
	`memberType` text,
	`resellerType` text,
	`accountStatus` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_email_unique` ON `members` (`email`);--> statement-breakpoint
CREATE TABLE `memberships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`memberId` integer,
	`tierLevel` text,
	`registrationDate` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expirationDate` text,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orderId` integer,
	`productId` integer,
	`quantity` integer,
	`price` integer,
	FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`memberId` integer,
	`orderNumber` text,
	`orderDate` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`totalPrice` integer,
	`shippingCost` integer,
	`orderStatus` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_orderNumber_unique` ON `orders` (`orderNumber`);--> statement-breakpoint
CREATE TABLE `outlets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`name` text(256) NOT NULL,
	`address` text(512) NOT NULL,
	`businessType` text(100) NOT NULL,
	`logo` text(512),
	`tax` integer DEFAULT 0,
	`settings` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payment_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orderId` integer,
	`transactionId` text,
	`paymentMethod` text,
	`paymentCode` text,
	`amount` integer,
	`transactionStatus` text,
	`transactionDate` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_transactions_transactionId_unique` ON `payment_transactions` (`transactionId`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(256) NOT NULL,
	`content` text(256) NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_category_products` (
	`categoryId` integer NOT NULL,
	`productId` integer NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `product_category`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`key` text NOT NULL,
	`product_id` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_stocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productId` integer,
	`qty` integer,
	`allocatedQty` integer,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_stocks_productId_unique` ON `product_stocks` (`productId`);--> statement-breakpoint
CREATE TABLE `product_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`outletId` integer NOT NULL,
	`name` text(256) NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`weight` integer,
	`price` integer,
	`description` text,
	`sku` text
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ipaddr` text(256) NOT NULL,
	`uid` integer NOT NULL,
	`refreshToken` text(256) NOT NULL,
	`blacklist` integer NOT NULL,
	`kind` text(50) NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shipping_addresses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`shippingId` integer,
	`fullName` text,
	`phoneNumber` text,
	`street` text,
	`subDistrict` text,
	`city` text,
	`province` text,
	`zipCode` text,
	FOREIGN KEY (`shippingId`) REFERENCES `shippings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shippings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orderId` integer,
	`shippingMethod` text,
	`trackingNumber` text,
	`shippingDate` text,
	`deliveryDate` text,
	`shippingStatus` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`avatar` text,
	`displayName` text(50),
	`googleId` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`roles` text(256) NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text(256) NOT NULL,
	`email` text(256) NOT NULL,
	`password` text(256) NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
