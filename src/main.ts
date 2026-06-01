import { api } from './api.js';
import { CONFIG } from './config.js';
import { assertDatabaseConnectionOk, setupDb } from './utils/db.js';
import { models } from './utils/models.js';
import { migrator } from './utils/umzug.js';

async function start() {
  await assertDatabaseConnectionOk();
  await migrator.up();

  setupDb(models);

  api.listen(CONFIG.PORT, () => {
    console.log(`server running on ${CONFIG.PORT}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
