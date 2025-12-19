import app from './app.js';
import { getConfig } from './config.js';

const config = getConfig();
const port = config.API_PORT;

const server = app.listen(port, () => {
  console.log(`[PayAgent API] Server running on http://localhost:${port}`);
  console.log(`[PayAgent API] Environment: ${config.NODE_ENV}`);
  console.log(`[PayAgent API] Network: ${config.EVM_NETWORK}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${port} is already in use.`);
    console.error(`   Please either:`);
    console.error(`   1. Stop the process using port ${port}:`);
    console.error(`      lsof -ti:${port} | xargs kill -9`);
    console.error(`   2. Or set a different port in .env:`);
    console.error(`      API_PORT=4001\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

