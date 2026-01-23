CREATE TABLE `file_uploads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fileName` text,
	`size` integer NOT NULL,
	`mimeType` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stock_inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`outletId` integer NOT NULL,
	`itemId` integer NOT NULL,
	`itemType` text NOT NULL,
	`minQty` integer DEFAULT 0 NOT NULL,
	`qty` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
