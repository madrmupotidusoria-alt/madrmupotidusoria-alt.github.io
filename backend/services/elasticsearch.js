const { elasticClient } = require('../config/elasticsearch');

const setupElasticsearchIndex = async () => {
  try {
    // Check if 'breaches' index exists
    const indexExists = await elasticClient.indices.exists({
      index: 'breaches'
    });

    if (!indexExists) {
      // Create the index with mappings
      await elasticClient.indices.create({
        index: 'breaches',
        body: {
          mappings: {
            properties: {
              email: {
                type: 'text',
                analyzer: 'case_sensitive_keyword',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256
                  },
                  wildcard: {
                    type: 'wildcard',
                    ignore_above: 256
                  }
                }
              },
              username: {
                type: 'text',
                analyzer: 'case_sensitive_keyword',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256
                  },
                  wildcard: {
                    type: 'wildcard',
                    ignore_above: 256
                  }
                }
              },
              password: {
                type: 'keyword',
                ignore_above: 256,
                fields: {
                  wildcard: {
                    type: 'wildcard',
                    ignore_above: 256
                  }
                }
              },
              ip: {
                type: 'keyword',
                ignore_above: 45,
                fields: {
                  wildcard: {
                    type: 'wildcard',
                    ignore_above: 45
                  }
                }
              },
              phone: {
                type: 'keyword',
                ignore_above: 45,
                fields: {
                  wildcard: {
                    type: 'wildcard',
                    ignore_above: 45
                  }
                }
              },
              source: {
                type: 'keyword',
                ignore_above: 256,
                fields: {
                  wildcard: {
                    type: 'wildcard',
                    ignore_above: 256
                  }
                }
              },
              raw: {
                type: 'object',
                enabled: true
              }
            }
          },
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
            'index.max_result_window': 100000,
            analysis: {
              analyzer: {
                case_sensitive_keyword: {
                  type: 'custom',
                  tokenizer: 'keyword'
                }
              }
            }
          }
        }
      });

      console.log('✅ Elasticsearch "breaches" index created successfully');
      return { created: true, index: 'breaches' };
    } else {
      console.log('ℹ️ Elasticsearch "breaches" index already exists');
      return { created: false, index: 'breaches' };
    }
  } catch (error) {
    console.error('❌ Error setting up Elasticsearch index:', error);
    throw error;
  }
};

module.exports = { setupElasticsearchIndex };
