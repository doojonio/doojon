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
    },
    'liked_by': {
      'type': 'string',
    },
  },
  'post_comments': {
    'create_time': {
      'type': 'timestamp',
    },
    'id': {
      'type': 'string',
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
    },
    'post_id': {
      'type': 'string',
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
    },
    'reg_date': {
      'type': 'date',
    },
    'username': {
      'type': 'string',
    },
  },
};
