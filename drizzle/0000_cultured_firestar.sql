CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`sender` text NOT NULL,
	`text` text NOT NULL,
	`timestamp` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`display_name` text,
	`picture_url` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
