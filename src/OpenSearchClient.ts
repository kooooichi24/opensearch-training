import fs from "fs";
import { Client, RequestParams } from "@opensearch-project/opensearch";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";

export interface CallDocument {
  call_id: string;
  title: string;
  transcription: string;
  customer: string;
  phone_number: string;
  participants: string[];
  call_datetime: string;
}

export interface IOpenSearchClient {
  search(
    indexName: string,
    query: RequestParams.Search
  ): Promise<Record<string, any>>;
  create(indexName: string): Promise<Record<string, any>>;
  addDocument(
    indexName: string,
    document: CallDocument
  ): Promise<Record<string, any>>;
  bulkAddDocuments(
    indexName: string,
    documents: CallDocument[]
  ): Promise<void>;
}

export class OpenSearchClient implements IOpenSearchClient {
  private CA_CERTS_PATH = "./opensearch/root-ca.pem";
  private client: Client;

  constructor() {
    console.log("Stage: " + process.env.STAGE);

    if (process.env.STAGE === "local") {
      this.client = new Client({
        node: "https://admin:admin@localhost:9200",
        ssl: {
          ca: fs.readFileSync(this.CA_CERTS_PATH),
        },
      });
    } else {
      this.client = new Client({
        ...AwsSigv4Signer({
          region: "ap-northeast-1",
          getCredentials: () => {
            const credentialsProvider = defaultProvider();
            return credentialsProvider();
          },
        }),
        node: "endpoint url",
      });
    }
  }

  async search(indexName: string, query: any): Promise<Record<string, any>> {
    console.log(
      "Searching index: " + indexName,
      " with query: " + JSON.stringify(query)
    );

    const response = await this.client.search({
      index: indexName,
      body: query,
    });
    console.log("Response: " + JSON.stringify(response.body));

    return response.body;
  }

  async create(indexName: string): Promise<Record<string, any>> {
    console.log("Creating index: " + indexName);

    const response = await this.client.indices.create({ index: indexName });
    console.log("Response: " + JSON.stringify(response.body));

    return response.body;
  }

  async addDocument(
    indexName: string,
    document: CallDocument
  ): Promise<Record<string, any>> {
    console.log("Adding document: " + JSON.stringify(document));

    const response = await this.client.index({
      id: document.call_id,
      index: indexName,
      body: document,
      refresh: true,
    });

    console.log("Response: " + JSON.stringify(response.body));

    return response.body;
  }

  async bulkAddDocuments(
    indexName: string,
    documents: CallDocument[]
  ): Promise<void> {
    console.log("Adding documents: " + JSON.stringify(documents));

    await this.client.helpers.bulk({
      datasource: documents,
      onDocument: (doc) => {
        return {
          index: { _index: indexName, _id: doc.call_id },
        };
      },
    });
  }
}
