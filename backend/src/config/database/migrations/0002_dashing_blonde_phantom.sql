CREATE TYPE "public"."valid_time_unit" AS ENUM('minutes', 'days', 'months');--> statement-breakpoint
ALTER TABLE "ticket" ADD COLUMN "valid_time_value" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ticket" ADD COLUMN "valid_time_unit" "valid_time_unit" NOT NULL;