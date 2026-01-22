CREATE TABLE `app_roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`roleType` text(256),
	`enabled` integer DEFAULT true,
	`path` text(512),
	`contents` text,
	`description` text(512),
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
