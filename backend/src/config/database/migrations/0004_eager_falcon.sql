ALTER TABLE "ticket_order" DROP CONSTRAINT "ticket_order_user_id_ticket_id_pk";--> statement-breakpoint
ALTER TABLE "ticket_order" ADD COLUMN "id" uuid PRIMARY KEY NOT NULL;