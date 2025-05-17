const sequelize = require("../config/database");

const clearData = async () => {
  try {
    console.log("Starting database cleanup...");

    // Disable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // Get all table names
    const [tables] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'pmi_onboarding'"
    );

    // Truncate all tables
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`Clearing table: ${tableName}`);
      await sequelize.query(`TRUNCATE TABLE ${tableName}`);
    }

    // Re-enable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("Database cleanup completed successfully!");
  } catch (error) {
    console.error("Error cleaning database:", error);
  }
};

// Run the cleanup
if (require.main === module) {
  clearData()
    .then(() => {
      console.log("Cleanup completed successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Cleanup failed:", err);
      process.exit(1);
    });
}

module.exports = clearData;
