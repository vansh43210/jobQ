import { pgTable, varchar, integer, pgEnum, timestamp} from "drizzle-orm/pg-core";

export const statusType = pgEnum('statustype', ['pending', 'running', 'completed', 'failed'])

export const jobsTable = pgTable('jobs', {
    job_id: integer().primaryKey().generatedAlwaysAsIdentity(),
    job_title: varchar().notNull(),
    status: statusType().default('pending'),
    type: varchar().notNull(),
    createdAt: timestamp().defaultNow(),
})