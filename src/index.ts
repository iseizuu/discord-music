import Client from "./structures/Client";

import { config } from "dotenv";
config();

const client = new Client();

client.build();
