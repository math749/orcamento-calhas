ALTER TABLE `budgets` MODIFY COLUMN `userId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `budgets` MODIFY COLUMN `status` enum('draft','sent','completed') NOT NULL DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `budgets` ADD `clientPhone` varchar(20);