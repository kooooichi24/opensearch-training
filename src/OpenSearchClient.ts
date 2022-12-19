import fs from "fs";
import { Client, RequestParams } from "@opensearch-project/opensearch";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { BulkHelperOptions } from "@opensearch-project/opensearch/lib/Helpers";
import {
  RequestBody,
  TransportRequestOptions,
} from "@opensearch-project/opensearch/lib/Transport";

export interface IOpenSearchClient {
  search<TRequestBody extends RequestBody = Record<string, any>>(
    params?: RequestParams.Search<TRequestBody>,
    options?: TransportRequestOptions
  ): Promise<Record<string, any>>;
  index<TRequestBody extends RequestBody = Record<string, any>>(
    params?: RequestParams.Index<TRequestBody>,
    options?: TransportRequestOptions
  ): Promise<void>;
  bulk<TDocument = unknown>(
    options: BulkHelperOptions<TDocument>,
    reqOptions?: TransportRequestOptions
  ): Promise<void>;

  // for local setup
  indicesCreate<TRequestBody extends RequestBody = Record<string, any>>(
    params?: RequestParams.IndicesCreate<TRequestBody>,
    options?: TransportRequestOptions
  ): Promise<void>;
  indicesDelete(
    params?: RequestParams.IndicesDelete,
    options?: TransportRequestOptions
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
        node: "https://vpc-opensearch-training-v6hkstq4xadg37eyrhrfaw4kui.ap-northeast-1.es.amazonaws.com",
      });
    }
  }

  async search<TRequestBody extends RequestBody = Record<string, any>>(
    params?: RequestParams.Search<TRequestBody>,
    options?: TransportRequestOptions
  ): Promise<Record<string, any>> {
    console.log("search called");

    const response = await this.client.search(params, options);

    return response.body;
  }

  async index<TRequestBody extends RequestBody = Record<string, any>>(
    params?: RequestParams.Index<TRequestBody> | undefined,
    options?: TransportRequestOptions | undefined
  ): Promise<void> {
    console.log("index called");

    await this.client.index(params, options);
  }

  async bulk<TDocument = unknown>(
    options: BulkHelperOptions<TDocument>,
    reqOptions?: TransportRequestOptions
  ): Promise<void> {
    console.log("bulk called");

    await this.client.helpers.bulk(options, reqOptions);
  }

  async indicesCreate<TRequestBody extends RequestBody = Record<string, any>>(
    params?: RequestParams.IndicesCreate<TRequestBody> | undefined,
    options?: TransportRequestOptions | undefined
  ): Promise<void> {
    console.log("indicesCreate called");

    await this.client.indices.create(params, options);
  }

  async indicesDelete(
    params?: RequestParams.IndicesDelete | undefined,
    options?: TransportRequestOptions | undefined
  ): Promise<void> {
    console.log("indicesDelete called");

    await this.client.indices.delete(params, options);
  }
}
