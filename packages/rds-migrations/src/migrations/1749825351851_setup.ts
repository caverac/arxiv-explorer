import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

/**
 * Set up migration to create the vector extension in PostgreSQL
 * @param pgm - MigrationBuilder instance
 */
export async function up(pgm: MigrationBuilder): Promise<void> {
  // add vector extension to PostgreSQL
  pgm.createExtension('vector', { ifNotExists: true })

  // create papers table
  pgm.createTable('papers', {
    id: { type: 'serial', primaryKey: true },
    code: { type: 'text', notNull: true, unique: true },
    title: { type: 'text', notNull: true },
    summary: { type: 'text', notNull: true },
    embedding: { type: 'vector(1536)', notNull: true },
    href: { type: 'text', notNull: true, unique: true },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
  })

  // create ideas table
  pgm.createTable('ideas', {
    id: { type: 'serial', primaryKey: true },
    paper_id: { type: 'integer', notNull: true, references: 'papers(id)' },
    content: { type: 'text', notNull: true },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
  })

  // create references table
  pgm.createTable('references', {
    id: { type: 'serial', primaryKey: true },
    paper_id: { type: 'integer', notNull: true, references: 'papers(id)' },
    content: { type: 'text', notNull: true },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
  })
}

/**
 * Revert migration by dropping the vector extension in PostgreSQL
 * @param pgm - MigrationBuilder instance
 */
export async function down(pgm: MigrationBuilder): Promise<void> {
  // drop references table
  pgm.dropTable('references', { ifExists: true })

  // drop ideas table
  pgm.dropTable('ideas', { ifExists: true })

  // drop papers table
  pgm.dropTable('papers', { ifExists: true })

  // drop vector extension
  pgm.dropExtension('vector', { ifExists: true })
}
