CREATE TABLE `user_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`avatar` text,
	`displayName` text(50),
	`googleId` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
