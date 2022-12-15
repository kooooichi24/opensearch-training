import { OpenSearchClient } from "../../src/OpenSearchClient";

const setup = async (): Promise<void> => {
  const INDEX_NAME = "calls";
  const openSearchClient = new OpenSearchClient();

  // remove index
  await openSearchClient.indicesDelete({
    index: INDEX_NAME,
  });

  // create index
  const mappings = {
    properties: {
      title: {
        type: "text",
      },
      transcription: {
        type: "text",
      },
      customer: {
        type: "text",
      },
      phone_number: {
        type: "keyword",
      },
      participants: {
        type: "text",
      },
      call_datetime: {
        type: "date",
      },
    },
  };
  await openSearchClient.indicesCreate({
    index: INDEX_NAME,
    body: {
      mappings,
    },
  });

  console.log("setup completed");
};

setup();
