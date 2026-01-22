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
CREATE TABLE `product_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`outletId` integer NOT NULL,
	`name` text(256) NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
