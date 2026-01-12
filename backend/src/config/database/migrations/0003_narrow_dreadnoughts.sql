ALTER TABLE "ticket_order" DROP CONSTRAINT "ticket_order_concession_id_concession_id_fk";
--> statement-breakpoint
ALTER TABLE "ticket_order" DROP COLUMN "concession_id";