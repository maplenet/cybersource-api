import { PORT } from "./src/config/env";
import app from "./src/app";
import { AppDataSource } from "./src/config/database";

async function main() {
  try {
    await AppDataSource.initialize();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

main();
