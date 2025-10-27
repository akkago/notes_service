import "reflect-metadata";
import { ServiceBroker } from "moleculer";
import ApiGateway from "moleculer-web";
import DatabaseService from "./services/database.service";
import NotesService from "./services/notes.service";
import UsersService from "./services/users.service";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create broker
const broker = new ServiceBroker({
  namespace: "notes",
  nodeID: "notes-backend",
  logger: {
    type: "Console",
    options: {
      level: process.env.MOLECULER_LOG_LEVEL || "info",
      colors: true,
      moduleColors: false,
      formatter: "full",
      objectPrinter: null,
      autoPadding: false
    }
  },
  transporter: "TCP"
});

// Load services
broker.createService(ApiGateway, {
  name: "api",
  settings: {
    port: process.env.PORT || 3000,
    routes: [
      {
        path: "/api",
        whitelist: [
          "notes.*",
          "users.*"
        ],
        use: [],
        mergeParams: true,
        authentication: false,
        authorization: false,
        autoAliases: true,
        aliases: {},
        mappingPolicy: "all",
        logging: true
      }
    ],
    assets: {
      folder: "public",
      options: {}
    }
  }
});

broker.createService(DatabaseService);
broker.createService(NotesService);
broker.createService(UsersService);

// Start broker
broker.start()
  .then(() => {
    console.log("🚀 Notes service backend started successfully!");
    console.log(`📡 API Gateway running on port ${process.env.PORT || 3000}`);
  })
  .catch(err => {
    console.error("❌ Failed to start backend:", err);
    process.exit(1);
  });
