import { api } from './api.js';
import { CONFIG } from './config.js';
import { setupDb } from './utils/db.js';
import { models } from './utils/models.js';

setupDb(models);

api.listen(CONFIG.PORT, () => {
  console.log(`server running on ${CONFIG.PORT}`);
});
