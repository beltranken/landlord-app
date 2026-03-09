CREATE TYPE "public"."invoice_reason" AS ENUM('rent', 'deposit', 'utility', 'maintenance', 'late_fee', 'damage', 'adjustment', 'credit', 'others');
CREATE TYPE "public"."payment_mode" AS ENUM('cash', 'card', 'bank_transfer', 'check', 'e_wallet', 'other');
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'confirmed', 'cancelled');
CREATE TYPE "public"."property_feature_type" AS ENUM('number', 'text', 'boolean', 'option');
CREATE TYPE "public"."property_status" AS ENUM('available', 'under_maintenance', 'unavailable', 'rented');
CREATE TYPE "public"."property_type" AS ENUM('complex', 'condo', 'apartment', 'room');
CREATE TYPE "public"."rent_frequency" AS ENUM('weekly', 'biweekly', 'monthly', 'yearly');
CREATE TYPE "public"."rent_status" AS ENUM('draft', 'active', 'expired', 'terminated');
CREATE TYPE "public"."user_role" AS ENUM('owner', 'tenant', 'collector');
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended');
CREATE TABLE "invoice_attachments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoice_attachments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"invoice_id" integer NOT NULL,
	"url" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "invoice_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoice_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"invoice_id" integer NOT NULL,
	"description" text,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "invoices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"rent_id" integer NOT NULL,
	"invoice_reason" "invoice_reason" NOT NULL,
	"description" text,
	"period" integer NOT NULL,
	"amount" integer NOT NULL,
	"due_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "organization_users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organization_users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"organization_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" "user_role" DEFAULT 'tenant' NOT NULL,
	"is_disabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

CREATE TABLE "organizations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organizations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"tax_id" varchar(50),
	"street" varchar(100),
	"street2" varchar(100),
	"city" varchar(100),
	"state" varchar(100),
	"postal_code" varchar(20),
	"country" varchar(100),
	"latitude" text,
	"longitude" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

CREATE TABLE "payment_attachments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_attachments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"payment_id" integer NOT NULL,
	"url" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "payments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"amount" integer NOT NULL,
	"date" date NOT NULL,
	"confirmed_date" date,
	"cancelled_date" date,
	"mode" "payment_mode" NOT NULL,
	"status" "payment_status" NOT NULL,
	"reference_number" varchar(255),
	"rent_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "properties" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "properties_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"organization_id" integer NOT NULL,
	"property_status" "property_status" NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "property_type" NOT NULL,
	"parent_id" integer,
	"default_rent_frequency" "rent_frequency" DEFAULT 'monthly' NOT NULL,
	"default_rent_amount" integer NOT NULL,
	"street" varchar(100),
	"street2" varchar(100),
	"city" varchar(100),
	"state" varchar(100),
	"postal_code" varchar(20),
	"country" varchar(100),
	"latitude" text,
	"longitude" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "property_attachments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "property_attachments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"property_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "property_feature_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "property_feature_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"type" "property_feature_type" DEFAULT 'text' NOT NULL,
	"options" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "property_feature_types_name_unique" UNIQUE("name")
);

CREATE TABLE "property_features" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "property_features_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"property_id" integer NOT NULL,
	"property_feature_type_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"value" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "property_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "property_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"property_id" integer NOT NULL,
	"property_feature_id" integer,
	"url" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "rent_changes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rent_changes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"rent_id" integer NOT NULL,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"amount" integer NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "rents" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"property_id" integer NOT NULL,
	"tenant_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"frequency" "rent_frequency" DEFAULT 'monthly' NOT NULL,
	"amount" integer NOT NULL,
	"grace_period_days" integer NOT NULL,
	"next_billing_date" date NOT NULL,
	"status" "rent_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "tenant_files" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tenant_files_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tenant_id" integer NOT NULL,
	"image" varchar(255),
	"name" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "tenant_references" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tenant_references_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tenant_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"relationship" varchar(255),
	"phone" varchar(20),
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "tenants" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tenants_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"organization_id" integer NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"date_of_birth" date,
	"street" varchar(100),
	"street2" varchar(100),
	"city" varchar(100),
	"state" varchar(100),
	"postal_code" varchar(20),
	"country" varchar(100),
	"latitude" text,
	"longitude" text,
	"address_same_as_parent" boolean DEFAULT false NOT NULL,
	"relationship" varchar(255),
	"parent_id" integer,
	"user_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL
);

CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" varchar(255),
	"phone" varchar(20),
	"date_of_birth" timestamp,
	"address" text,
	"status" "user_status" DEFAULT 'inactive' NOT NULL,
	"street" varchar(100),
	"street2" varchar(100),
	"city" varchar(100),
	"state" varchar(100),
	"postal_code" varchar(20),
	"country" varchar(100),
	"latitude" text,
	"longitude" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

ALTER TABLE "invoice_attachments" ADD CONSTRAINT "invoice_attachments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "invoice_attachments" ADD CONSTRAINT "invoice_attachments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "invoice_attachments" ADD CONSTRAINT "invoice_attachments_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_rent_id_rents_id_fk" FOREIGN KEY ("rent_id") REFERENCES "public"."rents"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "payment_attachments" ADD CONSTRAINT "payment_attachments_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "payment_attachments" ADD CONSTRAINT "payment_attachments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "payment_attachments" ADD CONSTRAINT "payment_attachments_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "payments" ADD CONSTRAINT "payments_rent_id_rents_id_fk" FOREIGN KEY ("rent_id") REFERENCES "public"."rents"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "payments" ADD CONSTRAINT "payments_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "properties" ADD CONSTRAINT "properties_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "properties" ADD CONSTRAINT "properties_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "properties" ADD CONSTRAINT "properties_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "properties" ADD CONSTRAINT "properties_parent_id" FOREIGN KEY ("parent_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "property_attachments" ADD CONSTRAINT "property_attachments_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "property_attachments" ADD CONSTRAINT "property_attachments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "property_attachments" ADD CONSTRAINT "property_attachments_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "property_features" ADD CONSTRAINT "property_features_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "property_features" ADD CONSTRAINT "property_features_property_feature_type_id_property_feature_types_id_fk" FOREIGN KEY ("property_feature_type_id") REFERENCES "public"."property_feature_types"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "property_features" ADD CONSTRAINT "property_features_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "property_features" ADD CONSTRAINT "property_features_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_feature_id_property_features_id_fk" FOREIGN KEY ("property_feature_id") REFERENCES "public"."property_features"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "rent_changes" ADD CONSTRAINT "rent_changes_rent_id_rents_id_fk" FOREIGN KEY ("rent_id") REFERENCES "public"."rents"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "rent_changes" ADD CONSTRAINT "rent_changes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "rent_changes" ADD CONSTRAINT "rent_changes_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "rents" ADD CONSTRAINT "rents_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "rents" ADD CONSTRAINT "rents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "rents" ADD CONSTRAINT "rents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "rents" ADD CONSTRAINT "rents_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "tenant_files" ADD CONSTRAINT "tenant_files_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "tenant_files" ADD CONSTRAINT "tenant_files_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "tenant_files" ADD CONSTRAINT "tenant_files_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "tenant_references" ADD CONSTRAINT "tenant_references_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "tenant_references" ADD CONSTRAINT "tenant_references_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "tenant_references" ADD CONSTRAINT "tenant_references_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_parent_id" FOREIGN KEY ("parent_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
CREATE UNIQUE INDEX "org_user_unique_idx" ON "organization_users" USING btree ("organization_id","user_id");