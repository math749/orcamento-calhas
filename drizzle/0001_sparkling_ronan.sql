CREATE TABLE `budgetItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`budgetId` int NOT NULL,
	`productId` int NOT NULL,
	`materialId` int NOT NULL,
	`quantity` int NOT NULL,
	`length` int NOT NULL,
	`width` int NOT NULL,
	`squareMeter` int NOT NULL,
	`unitPrice` int NOT NULL,
	`totalPrice` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `budgetItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`clientName` varchar(255),
	`clientEmail` varchar(320),
	`totalPrice` int NOT NULL,
	`status` enum('draft','completed','sent') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budgets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`pricePerSqMeter` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('calha','rufo','pingadeira') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
