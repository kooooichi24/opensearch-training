import { CallDocument, OpenSearchClient } from "./OpenSearchClient";
import { data } from "./documents.json";

const main = async (): Promise<void> => {
  const openSearchClient = new OpenSearchClient();

  const documents: CallDocument[] = data;
  await openSearchClient.bulkAddDocuments("calls", documents);
  await openSearchClient.search("calls", {
    query: {
      prefix: {
        transcription: "zoom",
      },
    },
  });
};

main();
