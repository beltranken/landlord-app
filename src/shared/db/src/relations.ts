import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  organizationsTable: {
    organizationUsers: r.many.organizationUsersTable({
      from: r.organizationsTable.id,
      to: r.organizationUsersTable.organizationId,
    }),
    properties: r.many.propertiesTable({
      from: r.organizationsTable.id,
      to: r.propertiesTable.organizationId,
    }),
    tenants: r.many.tenantsTable({
      from: r.organizationsTable.id,
      to: r.tenantsTable.organizationId,
    }),
  },

  usersTable: {
    organizationUsers: r.many.organizationUsersTable({
      from: r.usersTable.id,
      to: r.organizationUsersTable.userId,
    }),
  },

  organizationUsersTable: {
    organization: r.one.organizationsTable({
      from: r.organizationUsersTable.organizationId,
      to: r.organizationsTable.id,
    }),
    user: r.one.usersTable({
      from: r.organizationUsersTable.userId,
      to: r.usersTable.id,
    }),
  },

  propertiesTable: {
    organization: r.one.organizationsTable({
      from: r.propertiesTable.organizationId,
      to: r.organizationsTable.id,
    }),
    parent: r.one.propertiesTable({
      from: r.propertiesTable.parentId,
      to: r.propertiesTable.id,
    }),
    attachments: r.many.propertyAttachmentsTable({
      from: r.propertiesTable.id,
      to: r.propertyAttachmentsTable.propertyId,
    }),
    images: r.many.propertyImagesTable({
      from: r.propertiesTable.id,
      to: r.propertyImagesTable.propertyId,
    }),
    features: r.many.propertyFeaturesTable({
      from: r.propertiesTable.id,
      to: r.propertyFeaturesTable.propertyId,
    }),
    rents: r.many.rentsTable({
      from: r.propertiesTable.id,
      to: r.rentsTable.propertyId,
    }),
  },

  propertyAttachmentsTable: {
    property: r.one.propertiesTable({
      from: r.propertyAttachmentsTable.propertyId,
      to: r.propertiesTable.id,
    }),
  },

  propertyFeatureTypesTable: {
    features: r.many.propertyFeaturesTable({
      from: r.propertyFeatureTypesTable.id,
      to: r.propertyFeaturesTable.propertyFeatureTypeId,
    }),
  },

  propertyFeaturesTable: {
    property: r.one.propertiesTable({
      from: r.propertyFeaturesTable.propertyId,
      to: r.propertiesTable.id,
    }),
    featureType: r.one.propertyFeatureTypesTable({
      from: r.propertyFeaturesTable.propertyFeatureTypeId,
      to: r.propertyFeatureTypesTable.id,
    }),
  },

  propertyImagesTable: {
    property: r.one.propertiesTable({
      from: r.propertyImagesTable.propertyId,
      to: r.propertiesTable.id,
    }),
    feature: r.one.propertyFeaturesTable({
      from: r.propertyImagesTable.propertyFeatureId,
      to: r.propertyFeaturesTable.id,
    }),
  },

  tenantsTable: {
    organization: r.one.organizationsTable({
      from: r.tenantsTable.organizationId,
      to: r.organizationsTable.id,
    }),
    parent: r.one.tenantsTable({
      from: r.tenantsTable.parentId,
      to: r.tenantsTable.id,
    }),
    user: r.one.usersTable({
      from: r.tenantsTable.userId,
      to: r.usersTable.id,
    }),
    files: r.many.tenantFilesTable({
      from: r.tenantsTable.id,
      to: r.tenantFilesTable.tenantId,
    }),
    references: r.many.tenantReferencesTable({
      from: r.tenantsTable.id,
      to: r.tenantReferencesTable.tenantId,
    }),
    rents: r.many.rentsTable({
      from: r.tenantsTable.id,
      to: r.rentsTable.tenantId,
    }),
  },

  tenantFilesTable: {
    tenant: r.one.tenantsTable({
      from: r.tenantFilesTable.tenantId,
      to: r.tenantsTable.id,
    }),
  },

  tenantReferencesTable: {
    tenant: r.one.tenantsTable({
      from: r.tenantReferencesTable.tenantId,
      to: r.tenantsTable.id,
    }),
  },

  rentsTable: {
    property: r.one.propertiesTable({
      from: r.rentsTable.propertyId,
      to: r.propertiesTable.id,
    }),
    tenant: r.one.tenantsTable({
      from: r.rentsTable.tenantId,
      to: r.tenantsTable.id,
    }),
    charges: r.many.rentChargesTable({
      from: r.rentsTable.id,
      to: r.rentChargesTable.rentId,
    }),
    invoices: r.many.invoicesTable({
      from: r.rentsTable.id,
      to: r.invoicesTable.rentId,
    }),
    payments: r.many.paymentsTable({
      from: r.rentsTable.id,
      to: r.paymentsTable.rentId,
    }),
  },

  rentChargesTable: {
    rent: r.one.rentsTable({
      from: r.rentChargesTable.rentId,
      to: r.rentsTable.id,
    }),
  },

  invoicesTable: {
    rent: r.one.rentsTable({
      from: r.invoicesTable.rentId,
      to: r.rentsTable.id,
    }),
    attachments: r.many.invoiceAttachments({
      from: r.invoicesTable.id,
      to: r.invoiceAttachments.invoiceId,
    }),
    items: r.many.invoiceItemsTable({
      from: r.invoicesTable.id,
      to: r.invoiceItemsTable.invoiceId,
    }),
  },

  invoiceAttachments: {
    invoice: r.one.invoicesTable({
      from: r.invoiceAttachments.invoiceId,
      to: r.invoicesTable.id,
    }),
  },

  invoiceItemsTable: {
    invoice: r.one.invoicesTable({
      from: r.invoiceItemsTable.invoiceId,
      to: r.invoicesTable.id,
    }),
  },

  paymentsTable: {
    rent: r.one.rentsTable({
      from: r.paymentsTable.rentId,
      to: r.rentsTable.id,
    }),
    attachments: r.many.paymentAttachmentsTable({
      from: r.paymentsTable.id,
      to: r.paymentAttachmentsTable.paymentId,
    }),
  },

  paymentAttachmentsTable: {
    payment: r.one.paymentsTable({
      from: r.paymentAttachmentsTable.paymentId,
      to: r.paymentsTable.id,
    }),
  },
}));
