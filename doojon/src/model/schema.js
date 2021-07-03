export const schema = {
  'challenge_proposal_comment_likes': {
    'comment_id': {
      'type': 'string',
      'is_primary_key': true,
    },
    'liked_by': {
      'type': 'string',
      'is_primary_key': true,
    },
  },
  'challenge_proposal_comments': {
    'create_time': {
      'type': 'timestamp',
    },
    'id': {
      'type': 'string',
      'is_primary_key': true,
    },
    'parent_comment_id': {
      'type': 'string',
    },
    'proposal_id': {
      'type': 'string',
    },
    'text': {
      'type': 'string',
    },
    'update_time': {
      'type': 'timestamp',
    },
    'written_by': {
      'type': 'string',
    },
  },
  'challenge_proposal_likes': {
    'liked_by': {
      'type': 'string',
      'is_primary_key': true,
    },
    'proposal_id': {
      'type': 'string',
      'is_primary_key': true,
    },
  },
  'challenge_proposals': {
    'challenge_id': {
      'type': 'string',
    },
    'create_time': {
      'type': 'timestamp',
    },
    'id': {
      'type': 'string',
      'is_primary_key': true,
    },
  },
  'challenges': {
    'create_time': {
      'type': 'timestamp',
    },
    'description': {
      'type': 'string',
    },
    'id': {
      'type': 'string',
      'is_primary_key': true,
    },
    'is_hidden': {
      'type': 'boolean',
    },
    'is_public': {
      'type': 'boolean',
    },
    'proposed_by': {
      'type': 'string',
    },
    'title': {
      'type': 'string',
    },
    'update_time': {
      'type': 'timestamp',
    },
  },
  'post_comment_likes': {
    'comment_id': {
      'type': 'string',
      'is_primary_key': true,
    },
    'liked_by': {
      'type': 'string',
      'is_primary_key': true,
    },
  },
  'post_comments': {
    'create_time': {
      'type': 'timestamp',
    },
    'id': {
      'type': 'string',
      'is_primary_key': true,
    },
    'parent_comment_id': {
      'type': 'string',
    },
    'post_id': {
      'type': 'string',
    },
    'text': {
      'type': 'string',
    },
    'update_time': {
      'type': 'timestamp',
    },
    'written_by': {
      'type': 'string',
    },
  },
  'post_likes': {
    'liked_by': {
      'type': 'string',
      'is_primary_key': true,
    },
    'post_id': {
      'type': 'string',
      'is_primary_key': true,
    },
  },
  'posts': {
    'body': {
      'type': 'string',
    },
    'challenge_id': {
      'type': 'string',
    },
    'create_time': {
      'type': 'timestamp',
    },
    'id': {
      'type': 'string',
      'is_primary_key': true,
    },
    'title': {
      'type': 'string',
    },
    'update_time': {
      'type': 'timestamp',
    },
    'written_by': {
      'type': 'string',
    },
  },
  'profiles': {
    'create_time': {
      'type': 'timestamp',
    },
    'id': {
      'type': 'string',
      'is_primary_key': true,
    },
    'username': {
      'type': 'string',
    },
  },
};
