import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";
import { Database } from "./stacks/db";

export default {
  config(_input) {
    return {
      name: "my-sst-app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Database).stack(API);
  }
} satisfies SSTConfig;
