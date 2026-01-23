CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`outletId` integer NOT NULL,
	`name` text(256) NOT NULL,
	`code` text(150) NOT NULL,
	`description` text(500) NOT NULL,
	`unit` text(50) NOT NULL,
	`alternateUnit` text(50) NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`outletId` integer NOT NULL,
	`name` text(256) NOT NULL,
	`code` text(150) NOT NULL,
	`description` text(500) NOT NULL,
	`unit` text(50) NOT NULL,
	`alternateUnit` text(50) NOT NULL,
	`image` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
