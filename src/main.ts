import { api } from "./api";
import { CONFIG } from "./config";
import { setupDb } from "./utils/db";
import { models } from "./utils/models";

setupDb(models);

api.listen(CONFIG.PORT, () => {
  console.log(`server running on ${CONFIG.PORT}`);
});
