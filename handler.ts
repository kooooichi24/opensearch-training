import Lambda from "aws-lambda";
import { CallDocument } from "./src";
import { OpenSearchClient } from "./src/OpenSearchClient";
import { data } from "./opensearch/documents.json";

export const searchCalls = async (
  event: Lambda.APIGatewayProxyEvent
): Promise<Lambda.APIGatewayProxyResult> => {
  console.log("searchCalls is called: ", event);

  const openSearchClient = new OpenSearchClient();
  const result = await openSearchClient.search({
    index: "calls",
    body: {
      query: {
        prefix: {
          transcription: "zoom",
        },
      },
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      datas: result,
    }),
  };
};

export const addCallDocument = async (
  event: Lambda.APIGatewayProxyEvent
): Promise<Lambda.APIGatewayProxyResult> => {
  console.log("addCallDocument is called: ", event);

  const documents: CallDocument[] = data;

  const openSearchClient = new OpenSearchClient();
  await openSearchClient.bulk<CallDocument>({
    datasource: documents,
    onDocument: (doc) => {
      return {
        index: { _index: "calls", _id: doc.call_id },
      };
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "success",
    }),
  };
};
