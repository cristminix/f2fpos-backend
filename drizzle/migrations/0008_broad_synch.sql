CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY NOT NULL,
	`orderId` integer,
	`productId` integer,
	`quantity` integer,
	`price` integer,
	FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY NOT NULL,
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
CREATE TABLE `payment_transactions` (
	`id` integer PRIMARY KEY NOT NULL,
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
CREATE TABLE `product_stocks` (
	`id` integer PRIMARY KEY NOT NULL,
	`productId` integer,
	`qty` integer,
	`allocatedQty` integer,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_stocks_productId_unique` ON `product_stocks` (`productId`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`weight` integer,
	`price` integer,
	`description` text,
	`sku` text
);
--> statement-breakpoint
CREATE TABLE `shipping_addresses` (
	`id` integer PRIMARY KEY NOT NULL,
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
	`id` integer PRIMARY KEY NOT NULL,
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
ALTER TABLE `members` ADD `password` text;--> statement-breakpoint
ALTER TABLE `members` DROP COLUMN `passwordHash`;--> statement-breakpoint
ALTER TABLE `members` DROP COLUMN `passwordSalt`;