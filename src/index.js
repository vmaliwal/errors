const immutable = require('immutable');
const makeTransformErrors = require('./transformErrors');

const errors = {
  name: ['This field is required'],
  age: ['This field is required', 'Only numeric characters are allowed'],
  urls: [
    {},
    {},
    {
      site: {
        code: ['This site code is invalid'],
        id: ['Unsupported id'],
      },
    },
  ],
  url: {
    site: {
      code: ['This site code is invalid'],
      id: ['Unsupported id'],
    },
  },
  tags: [
    {},
    {
      non_field_errors: ['Only alphanumeric characters are allowed'],
      another_error: ['Only alphanumeric characters are allowed'],
      third_error: ['Third error'],
    },
    {},
    {
      non_field_errors: [
        'Minumum length of 10 characters is required',
        'Only alphanumeric characters are allowed',
      ],
    },
  ],
  tag: {
    nested: {
      non_field_errors: ['Only alphanumeric characters are allowed'],
    },
  },
};

module.exports = makeTransformErrors({ immutable })(errors, ['url', 'urls']);
