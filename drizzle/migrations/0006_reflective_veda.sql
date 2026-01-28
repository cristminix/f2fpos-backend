CREATE TABLE `member_addresses` (
	`id` integer PRIMARY KEY NOT NULL,
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
	`id` integer PRIMARY KEY NOT NULL,
	`memberId` integer,
	`bankName` text,
	`bankCode` text,
	`accountNumber` text,
	`accountHolderName` text,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `member_identities` (
	`id` integer PRIMARY KEY NOT NULL,
	`memberId` integer,
	`idNumber` text,
	`photoUrl` text,
	`uploadedAt` text,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` integer PRIMARY KEY NOT NULL,
	`fullName` text,
	`email` text,
	`phoneNumber` text,
	`passwordHash` text,
	`passwordSalt` text,
	`memberType` text,
	`accountStatus` text,
	`createdAt` text,
	`updatedAt` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_email_unique` ON `members` (`email`);--> statement-breakpoint
CREATE TABLE `memberships` (
	`id` integer PRIMARY KEY NOT NULL,
	`memberId` integer,
	`tierLevel` text,
	`registrationDate` text,
	`expirationDate` text,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
