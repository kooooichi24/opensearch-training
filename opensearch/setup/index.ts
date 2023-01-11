import { OpenSearchClient } from "../../src/OpenSearchClient";

const setup = async (): Promise<void> => {
  const INDEX_NAME = "calls";
  const openSearchClient = new OpenSearchClient();

  // delete index if exists
  const indexExists = await openSearchClient.exists({
    index: INDEX_NAME,
    local: true,
  });
  if (indexExists) {
    await openSearchClient.indicesDelete({
      index: INDEX_NAME,
    });
  }

  // create index
  const mappings = {
    properties: {
      call_id: {
        type: "text",
      },
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
