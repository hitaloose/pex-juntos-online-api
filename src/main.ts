import { api } from "./api";
import { CONFIG } from "./config";
import { setupDb } from "./utils/db";
import { models } from "./utils/models";

setupDb(models);

api.listen(CONFIG.API_PORT, () => {
  console.log(`server running on ${CONFIG.API_PORT}`);
});
