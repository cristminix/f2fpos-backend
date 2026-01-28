PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_member_identities` (
	`id` integer PRIMARY KEY NOT NULL,
	`memberId` integer,
	`idNumber` text,
	`photoUrl` text,
	`uploadedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_member_identities`("id", "memberId", "idNumber", "photoUrl", "uploadedAt") SELECT "id", "memberId", "idNumber", "photoUrl", "uploadedAt" FROM `member_identities`;--> statement-breakpoint
DROP TABLE `member_identities`;--> statement-breakpoint
ALTER TABLE `__new_member_identities` RENAME TO `member_identities`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_members` (
	`id` integer PRIMARY KEY NOT NULL,
	`fullName` text,
	`email` text,
	`phoneNumber` text,
	`passwordHash` text,
	`passwordSalt` text,
	`memberType` text,
	`accountStatus` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_members`("id", "fullName", "email", "phoneNumber", "passwordHash", "passwordSalt", "memberType", "accountStatus", "createdAt", "updatedAt") SELECT "id", "fullName", "email", "phoneNumber", "passwordHash", "passwordSalt", "memberType", "accountStatus", "createdAt", "updatedAt" FROM `members`;--> statement-breakpoint
DROP TABLE `members`;--> statement-breakpoint
ALTER TABLE `__new_members` RENAME TO `members`;--> statement-breakpoint
CREATE UNIQUE INDEX `members_email_unique` ON `members` (`email`);--> statement-breakpoint
CREATE TABLE `__new_memberships` (
	`id` integer PRIMARY KEY NOT NULL,
	`memberId` integer,
	`tierLevel` text,
	`registrationDate` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expirationDate` text,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_memberships`("id", "memberId", "tierLevel", "registrationDate", "expirationDate") SELECT "id", "memberId", "tierLevel", "registrationDate", "expirationDate" FROM `memberships`;--> statement-breakpoint
DROP TABLE `memberships`;--> statement-breakpoint
ALTER TABLE `__new_memberships` RENAME TO `memberships`;