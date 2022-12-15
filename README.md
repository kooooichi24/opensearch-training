# opensearch-training

## How to deploy locally

```sh
$ yarn install
$ yarn deploy:es-local # if not activated the docker yet
$ yarn start:local
```

### 自己証明用のファイルの作成方法

- > For now, users can create a root-ca.pem file with contents from here or copy it from inside docker container /usr/share/opensearch/config/root-ca.pem). You can copy this exact piece in a root-ca.pem file anywhere on your local machine with -rw-r--r-- permissions and point that to the nodejs client. It should work.
- [GitHub Issue](https://github.com/opensearch-project/OpenSearch/issues/1501#issuecomment-961463423)

### Explicit mapping

1. Access OpenSearch Dashboard

   access `https://endpoint/` using your browser

2. Access Dev Tools
3. execute command. command [here](./opensearch/migration/)

## Reference

- [opensearchproject/opensearch](https://hub.docker.com/r/opensearchproject/opensearch)
- [Why use OpenSearch with Docker?](https://opensearch.org/docs/1.3/opensearch/install/docker/)
- [OpenSearch をローカル環境で Docker を利用して構築する](https://dev.classmethod.jp/articles/how-to-build-opensearch-with-docker/)
- [opensearch-js/DEVELOPER_GUIDE.md](https://github.com/opensearch-project/opensearch-js/blob/2f840e54860419f76ef8354a0fe070403d437386/DEVELOPER_GUIDE.md#getting-started)
- [documentation-website/\_clients/javascript/](https://github.com/opensearch-project/documentation-website/tree/main/_clients/javascript)
