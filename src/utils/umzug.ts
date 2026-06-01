import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { fileURLToPath } from 'url';
import { assertDatabaseConnectionOk, db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const migrator = new Umzug({
  migrations: {
    glob: [
      path.join(__dirname, '..', 'migrations', '*.{ts,js}'),
      { cwd: __dirname },
    ],
    resolve: ({ name, path: p, context }) => ({
      name,
      up: async () => {
        const migration = await import(p!);
        return migration.up({ context });
      },
      down: async () => {
        const migration = await import(p!);
        return migration.down?.({ context });
      },
    }),
  },
  context: db,
  storage: new SequelizeStorage({
    sequelize: db,
    modelName: 'SequelizeMeta',
    tableName: 'migrations',
  }),
  logger: console,
});

async function run() {
  await assertDatabaseConnectionOk();

  const cmd = process.argv[2] ?? 'up';

  if (cmd === 'up') {
    await migrator.up();
  } else if (cmd === 'down') {
    await migrator.down();
  } else if (cmd === 'pending') {
    console.table(await migrator.pending());
  } else if (cmd === 'executed') {
    console.table(await migrator.executed());
  } else if (cmd === 'reset') {
    await migrator.down({ to: 0 }).catch(() => {});
  } else {
    console.log(
      'Comandos: up | down | pending | executed | seed | unseed | reset'
    );
  }

  await db.close();
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
