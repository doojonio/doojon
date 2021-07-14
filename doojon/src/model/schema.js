export const schema = {
  'tables': {
    'challenge_comments': {
      'challenge_id': {
        'type': 'string',
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
      'id': {
        'type': 'string',
        'is_primary_key': true,
      },
    },
    'challenges': {
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
    'events': {
      'emitter': {
        'type': 'string',
      },
      'id': {
        'type': 'string',
        'is_primary_key': true,
      },
      'object': {
        'type': 'string',
      },
      'type': {
        'type': 'event',
      },
      'when': {
        'type': 'timestamp',
      },
    },
    'followers': {
      'follower': {
        'type': 'string',
        'is_primary_key': true,
      },
      'profile': {
        'type': 'string',
        'is_primary_key': true,
      },
    },
    'post_comments': {
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
    'posts': {
      'id': {
        'type': 'string',
        'is_primary_key': true,
      },
      'is_hidden': {
        'type': 'boolean',
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
  },
  'enums': {
    'event': [
      'following_started',
      'challenge_created',
      'challenge_commented',
      'challenge_proposed',
      'challenge_proposal_commented',
      'post_created',
      'post_liked',
      'post_commented',
      'post_comment_liked',
    ],
  },
};
