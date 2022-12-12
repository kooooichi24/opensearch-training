# opensearch-training

## Step

```sh
# OpenSearch と OpenSearch Dashboard を起動する
$ docker-compose up -d

# 起動しているか確認する
$ docker-compose ps
        Name                       Command               State                                 Ports
-----------------------------------------------------------------------------------------------------------------------------------
opensearch-dashboards   ./opensearch-dashboards-do ...   Up      0.0.0.0:5601->5601/tcp
opensearch-node1        ./opensearch-docker-entryp ...   Up      0.0.0.0:9200->9200/tcp, 9300/tcp, 0.0.0.0:9600->9600/tcp, 9650/tcp
opensearch-node2        ./opensearch-docker-entryp ...   Up      9200/tcp, 9300/tcp, 9600/tcp, 9650/tcp

# OpenSearch へアクセス
$ curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
{
  "name" : "opensearch-node1",
  "cluster_name" : "opensearch-cluster",
  "cluster_uuid" : "Z_jG7aUbTOy2IPlh-ocAmQ",
  "version" : {
    "distribution" : "opensearch",
    "number" : "2.4.0",
    "build_type" : "tar",
    "build_hash" : "744ca260b892d119be8164f48d92b8810bd7801c",
    "build_date" : "2022-11-15T04:47:22.592960163Z",
    "build_snapshot" : false,
    "lucene_version" : "9.4.1",
    "minimum_wire_compatibility_version" : "7.10.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}

# OpenSearch Dashboards へアクセス
`http://localhost:5601/`

# retrieve indices
$ curl -XGET https://localhost:9200/calls -u 'admin:admin' --insecure | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   231  100   231    0     0   4552      0 --:--:-- --:--:-- --:--:--  5775
{
  "calls": {
    "aliases": {},
    "mappings": {},
    "settings": {
      "index": {
        "creation_date": "1670815288568",
        "number_of_shards": "1",
        "number_of_replicas": "1",
        "uuid": "nYjfj7EeTiK1JTAeNna5iw",
        "version": {
          "created": "136257827"
        },
        "provided_name": "calls"
      }
    }
  }
}
```

### 自己証明用のファイルの作成方法

- > For now, users can create a root-ca.pem file with contents from here or copy it from inside docker container /usr/share/opensearch/config/root-ca.pem). You can copy this exact piece in a root-ca.pem file anywhere on your local machine with -rw-r--r-- permissions and point that to the nodejs client. It should work.
- [GitHub Issue](https://github.com/opensearch-project/OpenSearch/issues/1501#issuecomment-961463423)

## Reference

- [opensearchproject/opensearch](https://hub.docker.com/r/opensearchproject/opensearch)
- [Why use OpenSearch with Docker?](https://opensearch.org/docs/1.3/opensearch/install/docker/)
- [OpenSearch をローカル環境で Docker を利用して構築する](https://dev.classmethod.jp/articles/how-to-build-opensearch-with-docker/)
- [opensearch-js/DEVELOPER_GUIDE.md](https://github.com/opensearch-project/opensearch-js/blob/2f840e54860419f76ef8354a0fe070403d437386/DEVELOPER_GUIDE.md#getting-started)
- [documentation-website/\_clients/javascript/](https://github.com/opensearch-project/documentation-website/tree/main/_clients/javascript)
