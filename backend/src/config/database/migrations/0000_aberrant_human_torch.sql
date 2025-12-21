CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'application_manager');--> statement-breakpoint
CREATE TABLE "concession" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "concession_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"external_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"discount" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "concession_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "concession_external" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "concession_external_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "concession_external_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "person" (
	"pesel" varchar(11) PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"date_of_birth" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "person_pesel_unique" UNIQUE("pesel")
);
--> statement-breakpoint
CREATE TABLE "person_concession" (
	"person_pesel" varchar(11) NOT NULL,
	"concession_id" integer NOT NULL,
	CONSTRAINT "person_concession_person_pesel_concession_id_pk" PRIMARY KEY("person_pesel","concession_id")
);
--> statement-breakpoint
CREATE TABLE "ticket" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "ticket_id_unique" UNIQUE("id"),
	CONSTRAINT "ticket_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ticket_order" (
	"user_id" uuid NOT NULL,
	"ticket_id" uuid NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_to" timestamp NOT NULL,
	"concession_id" integer NOT NULL,
	"ordered_at" timestamp DEFAULT now() NOT NULL,
	"price" integer,
	CONSTRAINT "ticket_order_user_id_ticket_id_pk" PRIMARY KEY("user_id","ticket_id")
);
--> statement-breakpoint
CREATE TABLE "ticket_price" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ticket_price_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ticket_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_to" timestamp,
	CONSTRAINT "ticket_price_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "traffic_zone" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "traffic_zone_id_unique" UNIQUE("id"),
	CONSTRAINT "traffic_zone_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"pesel" varchar(11) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"password_hash" varchar(255) NOT NULL,
	"password_salt" varchar(255) NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_pesel_unique" UNIQUE("pesel")
);
--> statement-breakpoint
ALTER TABLE "person_concession" ADD CONSTRAINT "person_concession_person_pesel_person_pesel_fk" FOREIGN KEY ("person_pesel") REFERENCES "public"."person"("pesel") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person_concession" ADD CONSTRAINT "person_concession_concession_id_concession_external_id_fk" FOREIGN KEY ("concession_id") REFERENCES "public"."concession_external"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_order" ADD CONSTRAINT "ticket_order_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_order" ADD CONSTRAINT "ticket_order_ticket_id_ticket_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."ticket"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_order" ADD CONSTRAINT "ticket_order_concession_id_concession_id_fk" FOREIGN KEY ("concession_id") REFERENCES "public"."concession"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_price" ADD CONSTRAINT "ticket_price_ticket_id_ticket_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."ticket"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_pesel_idx" ON "users" USING btree ("pesel");