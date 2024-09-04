import { StackContext, Api, Table, use, Queue,Function} from "sst/constructs";
import { Database } from "./db";
// import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
export function API({ stack }: StackContext) {

  const queue = new Queue(stack, "my-first-queue", {

  });

  // const myLambda = new Function(stack, 'MyLambda', {
  //   handler: 'packages/functions/src/todo.rand',
  //   bind: [queue]
  // });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [use(Database)],
      },
    },
    routes: {
      "DELETE /{h}":"packages/functions/src/todo.del",
      "GET /todo/{l}": "packages/functions/src/todo.list",
      "GET /todo": "packages/functions/src/todo.get",
      "POST /todo":"packages/functions/src/todo.add",
      "GET /random":{
        function: {
          handler: "packages/functions/src/todo.rand",
          bind: [queue]
        }
      },
      // "GET /random1": {
      //   function: myLambda
      // }
    },
  });

  

  


  // const sendMessagePolicy = new PolicyStatement({
  //   actions: ['sqs:SendMessage'],
  //   resources: [queue.queueArn],
  // });

  // myLambda.addToRolePolicy(sendMessagePolicy);
  // queue.grantSendMessages
  // console.log("@@@@@@@@@@@@@@---------------->",queue);
  // queue.grantSendMessages(myLambda);
 
  stack.addOutputs({
    ApiEndpoint: api.url,
    // QueueURL:queue.queueUrl
  });
}
