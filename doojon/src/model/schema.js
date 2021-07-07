export const schema = {
  'challenge_comments': {
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
    'parent_id': {
      'type': 'string',
    },
    'text': {
      'type': 'string',
    },
    'update_time': {
      'type': 'timestamp',
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
    'personal_tag': {
      'type': 'string',
    },
    'proposed_by': {
      'type': 'string',
    },
    'public_tag': {
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
    'create_time': {
      'type': 'timestamp',
    },
    'id': {
      'type': 'string',
      'is_primary_key': true,
    },
    'tags': {
      'type': 'ARRAY',
    },
    'text': {
      'type': 'string',
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
  'profile_favorite_challenges': {
    'challenge_id': {
      'type': 'string',
      'is_primary_key': true,
    },
    'profile_id': {
      'type': 'string',
      'is_primary_key': true,
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
