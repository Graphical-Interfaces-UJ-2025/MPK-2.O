import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  boolean,
  date,
  pgEnum,
  primaryKey,
  index,
  decimal,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'application_manager']);

export const validTimeUnitEnum = pgEnum('valid_time_unit', ['minutes', 'days', 'months']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().notNull().unique(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    role: userRoleEnum('role').notNull(),
    email: varchar('email').notNull().unique(),
    pesel: varchar('pesel', { length: 11 }).notNull(),
    balance: integer('balance').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    passwordSalt: varchar('password_salt', { length: 255 }).notNull(),
  },
  (table) => [index('users_pesel_idx').on(table.pesel)]
);

export type UserRecord = typeof users.$inferSelect;
export type NewUserRecord = typeof users.$inferInsert;

export const ticket = pgTable('ticket', {
  id: uuid('id').primaryKey().notNull().unique(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  validTimeValue: integer('valid_time_value').notNull(),
  validTimeUnit: validTimeUnitEnum('valid_time_unit').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type TicketRecord = typeof ticket.$inferSelect;
export type NewTicketRecord = typeof ticket.$inferInsert;

export const trafficZone = pgTable('traffic_zone', {
  id: integer('id').primaryKey().notNull().unique(),
  name: varchar('name', { length: 255 }).notNull().unique(),
});

export type TrafficZoneRecord = typeof trafficZone.$inferSelect;
export type NewTrafficZoneRecord = typeof trafficZone.$inferInsert;

export const concession = pgTable('concession', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().notNull().unique(),
  externalId: integer('external_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  discount: integer('discount'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type ConcessionRecord = typeof concession.$inferSelect;
export type NewConcessionRecord = typeof concession.$inferInsert;

export const ticketOrder = pgTable('ticket_order', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'no action', onUpdate: 'no action' }),
  ticketId: uuid('ticket_id')
    .notNull()
    .references(() => ticket.id, { onDelete: 'no action', onUpdate: 'no action' }),
  validFrom: timestamp('valid_from').notNull(),
  validTo: timestamp('valid_to').notNull(),
  orderedAt: timestamp('ordered_at').notNull().defaultNow(),
  price: integer('price'),
  isRefunded: boolean('is_refunded').notNull().default(false),
});

export type TicketOrderRecord = typeof ticketOrder.$inferSelect;
export type NewTicketOrderRecord = typeof ticketOrder.$inferInsert;

export const ticketPrice = pgTable('ticket_price', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().notNull().unique(),
  ticketId: uuid('ticket_id')
    .notNull()
    .references(() => ticket.id, { onDelete: 'no action', onUpdate: 'no action' }),
  price: integer('price').notNull(),
  validFrom: timestamp('valid_from').notNull(),
  validTo: timestamp('valid_to'),
});

export type TicketPriceRecord = typeof ticketPrice.$inferSelect;
export type NewTicketPriceRecord = typeof ticketPrice.$inferInsert;

export const person = pgTable('person', {
  pesel: varchar('pesel', { length: 11 }).primaryKey().notNull().unique(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type PersonRecord = typeof person.$inferSelect;
export type NewPersonRecord = typeof person.$inferInsert;

export const concessionExternal = pgTable('concession_external', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type ConcessionExternalRecord = typeof concessionExternal.$inferSelect;
export type NewConcessionExternalRecord = typeof concessionExternal.$inferInsert;

export const personConcession = pgTable(
  'person_concession',
  {
    personPesel: varchar('person_pesel', { length: 11 })
      .notNull()
      .references(() => person.pesel, { onDelete: 'no action', onUpdate: 'no action' }),
    concessionId: integer('concession_id')
      .notNull()
      .references(() => concessionExternal.id, { onDelete: 'no action', onUpdate: 'no action' }),
  },
  (table) => [primaryKey({ columns: [table.personPesel, table.concessionId] })]
);

export type PersonConcessionRecord = typeof personConcession.$inferSelect;
export type NewPersonConcessionRecord = typeof personConcession.$inferInsert;

export const transactionTypeEnum = pgEnum('transaction_type', [
  'RECHARGE',
  'TICKET_PURCHASE',
  'TICKET_REFUND',
]);

export const transactionStatusEnum = pgEnum('transaction_status', [
  'PENDING',
  'COMPLETED',
  'FAILED',
]);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().notNull().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'no action', onUpdate: 'no action' }),
    type: transactionTypeEnum('type').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    ticketId: uuid('ticket_id').references(() => ticket.id, {
      onDelete: 'no action',
      onUpdate: 'no action',
    }),
    status: transactionStatusEnum('status').notNull().default('PENDING'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('transactions_user_id_idx').on(table.userId)]
);

export type TransactionRecord = typeof transactions.$inferSelect;
export type NewTransactionRecord = typeof transactions.$inferInsert;
