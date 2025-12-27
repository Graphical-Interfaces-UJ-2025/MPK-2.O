import 'reflect-metadata';
process.setMaxListeners(20);
import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
import { app } from './app';
import { db } from './config/database.config';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await db.execute(sql`SELECT 1`);
    console.log('Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error(
      'Failed to start server',
      error instanceof Error ? error : new Error(String(error))
    );
    process.exit(1);
  }
}

startServer();
