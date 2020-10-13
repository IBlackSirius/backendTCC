import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class operationsDraftfires1600113397491
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'operations_draftfires',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'operation_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'draftfires_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'boxes_id',
            type: 'uuid',
            isNullable: true,
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
    await queryRunner.createForeignKeys('operations_draftfires', [
      new TableForeignKey({
        name: 'Operation Id',
        columnNames: ['operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'operations',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
    await queryRunner.createForeignKeys('operations_draftfires', [
      new TableForeignKey({
        name: 'DraftFire Id',
        columnNames: ['draftfires_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'draftfires',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
    await queryRunner.createForeignKeys('operations_draftfires', [
      new TableForeignKey({
        name: 'Boxes Id',
        columnNames: ['boxes_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'storages',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('operations_draftfires');
  }
}
