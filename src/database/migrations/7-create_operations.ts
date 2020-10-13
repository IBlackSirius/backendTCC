import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class createOperation1600111513825
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'operations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'mining_company_id',
            type: 'uuid',
          },
          {
            name: 'mining_field_id',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
    await queryRunner.createForeignKeys('operations', [
      new TableForeignKey({
        name: 'Mining Company Id',
        columnNames: ['mining_field_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mining_fields',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
    await queryRunner.createForeignKeys('operations', [
      new TableForeignKey({
        name: 'Mining Field Id',
        columnNames: ['mining_company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mining_companies',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('operations');
  }
}
