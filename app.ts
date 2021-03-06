import express, { Request, Response } from "express";
import * as http from "http";
import * as bodyparser from "body-parser";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./users/users.routes.config";
import debug from "debug";

const app = express();
const server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog = debug("app");

app.use(bodyparser.json());
app.use(cors());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);
routes.push(new UsersRoutes(app));
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);
app.get("/", (req: Request, res: Response) =>
  res.status(200).send("Server up and running")
);
server.listen(port, () => {
  debugLog(`Server running at http://localhost:${port}`);
  routes.forEach((route) =>
    debugLog(`Routes configured for ${route.getName()}`)
  );
});
