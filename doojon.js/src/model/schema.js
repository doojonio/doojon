export const schema = {
  'challenges': {
    'create_time': {
      'type': 'timestamp',
    },
    'descr': {
      'type': 'string',
    },
    'id': {
      'type': 'string',
      'is_primary_key': true,
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
    'message': {
      'type': 'string',
    },
    'post_id': {
      'type': 'string',
    },
    'update_time': {
      'type': 'timestamp',
    },
    'writed_by': {
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
    'writted_by': {
      'type': 'string',
    },
  },
  'profiles': {
    'id': {
      'type': 'string',
      'is_primary_key': true,
    },
    'reg_date': {
      'type': 'date',
    },
    'username': {
      'type': 'string',
    },
  },
};
