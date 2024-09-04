import { StackContext, Table } from "sst/constructs";
import {API} from "./MyStack"
export function Database({ stack }: StackContext) {

  const table = new Table(stack, "db", {
    fields: {
      id: "string",  
      title: "string",  
    },
    primaryIndex: {
      partitionKey: "id", 
    },
  });

  return table;
}
 