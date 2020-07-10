const immutable = require('immutable');
const makeTransformErrors = require('./transformErrors');

const errors = {
  name: {
    first: ['Only alphanumeric characters are allowed'],
    last: ['Only alphanumeric characters are allowed'],
  },
  names: [
    {},
    {
      first: ['Only alphanumeric characters are allowed'],
      last: ['Only alphanumeric characters are allowed'],
    },
    {},
  ],
};

module.exports = makeTransformErrors({ immutable })(errors);
