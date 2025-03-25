import { startModules, startEndpoints, startEvents, app } from './modules.ts';
import dotenv from 'dotenv';

dotenv.config();

const exPort: number = parseInt(process.argv[2] || <string>process.env.SERVER_PORT);

const startServer = async () => {
    await startModules();
          startEndpoints();
          startEvents();  
};

if (typeof exPort === 'number' && exPort > 1023 && exPort < 65536) {
  startServer();
  
  app.listen(exPort, () => {
      console.log(`Zoom Rivet Server Started on port ${exPort}`);
  });
} else {
    console.log("Please use port range 1024-65535");
}