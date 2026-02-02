CREATE TABLE `product_category_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`key` text NOT NULL,
	`product_category_id` integer NOT NULL,
	FOREIGN KEY (`product_category_id`) REFERENCES `product_category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `product_category_products` DROP COLUMN `id`;