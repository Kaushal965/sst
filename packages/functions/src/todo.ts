import { Api, ApiHandler } from "sst/node/api";
import { Todo } from "@my-sst-app/core/todo";
import { Table } from "sst/node/table";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { API } from "../../../stacks/MyStack";
import { Queue } from "sst/node/queue";
// export const create = ApiHandler(async (_evt) => {
//   await Todo.create();

//   return {
//     statusCode: 200,
//     body: "Todo created",
//   };
// });
export const rand = ApiHandler(async (_evt) => {
  const random_number = Math.ceil(Math.random() * 10);

  const sqs = new SQSClient({
    region: "us-east-1", // specify your region

    endpoint: "https://vhehx527w2.execute-api.us-east-1.amazonaws.com",
  });

  const command = new SendMessageCommand({
    QueueUrl: Queue["my-first-queue"].queueUrl,
    MessageBody: JSON.stringify({
      message: `Random Number is ${random_number}`,
    }),
  });
  sqs.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify("Hello World!"),
  };
});
export const add = ApiHandler(async (_evt) => {
  const tableName = Table.db.tableName;
  const Client = new DynamoDBClient({});

  try {
    const body = JSON.parse(_evt.body);
    const { id, title } = body;
    // console.log(id,title);
    const params = {
      TableName: tableName,
      Item: {
        id: id,
        title: title,
      },
    };
    // console.log(params);

    await Client.send(new PutCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Item added successfully!" }),
    };
  } catch (error) {
    // console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to add item" }),
    };
  }
});
// export const list = ApiHandler(async (_evt) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(Todo.list()),
//   };
// });

export const del = ApiHandler(async (_evt) => {
  const pathSegments = _evt.rawPath.split("/");
  // console.log("dcDcccsccd",_evt);
  const id = pathSegments[pathSegments.length - 1];
  try {
    const tableName = Table.db.tableName;
    const client = new DynamoDBClient({});
    if (id) {
      const params = {
        TableName: tableName,
        Key: {
          id: id,
        },
      };
      // console.log(params);

      const result = await client.send(new DeleteCommand(params));
      // console.log(result);

      return {
        statusCode: 200,
        body: `Data with id ${id} has been deleted`,
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request" }),
    };
  } catch (error) {
    // console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process request" }),
    };
  }
});

export const get = ApiHandler(async (_evt) => {
  try {
    const tableName = Table.db.tableName;
    const client = new DynamoDBClient({});

    const params = {
      TableName: tableName,
    };
    // console.log(params);

    const result = await client.send(new ScanCommand(params));
    // console.log(result);

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request" }),
    };
  } catch (error) {
    // console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process request" }),
    };
  }
});

export const list = ApiHandler(async (_evt) => {
  const pathSegments = _evt.rawPath.split("/");
  const id = pathSegments[pathSegments.length - 1];

  try {
    const tableName = Table.db.tableName;
    const client = new DynamoDBClient({});
    if (id) {
      const params = {
        TableName: tableName,
        Key: {
          id: id,
        },
      };
      // console.log(params);

      const result = await client.send(new GetCommand(params));
      // console.log(result);

      return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request" }),
    };
  } catch (error) {
    // console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process request" }),
    };
  }
});
