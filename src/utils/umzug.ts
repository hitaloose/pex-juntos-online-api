import { Umzug, SequelizeStorage } from "umzug";
import path from "path";
import { assertDatabaseConnectionOk, db } from "./db";

export const migrator = new Umzug({
  migrations: {
    glob: [
      path.join(__dirname, "..", "migrations", "*.{ts,js}"),
      { cwd: __dirname },
    ],
    resolve: ({ name, path: p, context }) => {
      const migration = require(p!);
      return {
        name,
        up: async () => migration.up({ context }),
        down: async () => migration.down?.({ context }),
      };
    },
  },
  context: db,
  storage: new SequelizeStorage({
    sequelize: db,
    modelName: "SequelizeMeta",
    tableName: "migrations",
  }),
  logger: console,
});

async function run() {
  await assertDatabaseConnectionOk();

  const cmd = process.argv[2] ?? "up";

  if (cmd === "up") {
    await migrator.up();
  } else if (cmd === "down") {
    await migrator.down();
  } else if (cmd === "pending") {
    console.table(await migrator.pending());
  } else if (cmd === "executed") {
    console.table(await migrator.executed());
  } else if (cmd === "reset") {
    await migrator.down({ to: 0 }).catch(() => {});
  } else {
    console.log(
      "Comandos: up | down | pending | executed | seed | unseed | reset"
    );
  }

  await db.close();
}

if (require.main === module) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
