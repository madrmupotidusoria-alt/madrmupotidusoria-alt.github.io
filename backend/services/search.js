const { elasticClient } = require('../config/elasticsearch');
const { supabase } = require('../config/supabase');

const searchBreaches = async (query, searchType, page = 1, userId) => {
  const validTypes = ['email', 'username', 'ip', 'phone'];
  
  if (!validTypes.includes(searchType)) {
    throw new Error('Invalid search type');
  }

  if (!query || query.trim().length === 0) {
    throw new Error('Query cannot be empty');
  }

  if (query.length > 256) {
    throw new Error('Query too long');
  }

  const size = Math.min(100, Math.max(10, parseInt(page) * 10));
  const from = (parseInt(page) - 1) * 10;

  // Build Elasticsearch query
  const esQuery = {
    index: 'breaches',
    body: {
      query: {
        bool: {
          should: [
            // Exact match on keyword field
            {
              term: {
                [`${searchType}.keyword`]: query
              }
            },
            // Wildcard search
            {
              wildcard: {
                [`${searchType}.wildcard`]: {
                  value: `*${query}*`,
                  case_insensitive: false
                }
              }
            }
          ],
          minimum_should_match: 1
        }
      },
      from: from,
      size: size,
      sort: [
        { _score: { order: 'desc' } }
      ]
    }
  };

  try {
    const response = await elasticClient.search(esQuery);
    
    const results = response.body.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));

    const total = response.body.hits.total.value;

    // Log search to Supabase
    await supabase
      .from('scans')
      .insert({
        user_id: userId,
        query: query,
        search_type: searchType,
        result_count: total
      });

    return {
      total,
      page: parseInt(page),
      results,
      hasMore: from + results.length < total
    };
  } catch (error) {
    console.error('Elasticsearch search error:', error);
    throw new Error('Search failed');
  }
};

module.exports = { searchBreaches };
