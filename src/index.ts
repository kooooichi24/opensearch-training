import { OpenSearchClient } from "./OpenSearchClient";
import { data } from "../opensearch/documents.json";

interface CallDocument {
  call_id: string;
  title: string;
  transcription: string;
  customer: string;
  phone_number: string;
  participants: string[];
  call_datetime: string;
}

const main = async (): Promise<void> => {
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
  console.log("search result: ", result);
};

main();
