const { Client } = require('@elastic/elasticsearch');

const elasticNode = process.env.ELASTIC_NODE;
const elasticApiKey = process.env.ELASTIC_API_KEY;

if (!elasticNode || !elasticApiKey) {
  throw new Error('Missing Elasticsearch environment variables');
}

const elasticClient = new Client({
  node: elasticNode,
  auth: {
    apiKey: elasticApiKey
  }
});

module.exports = { elasticClient };
