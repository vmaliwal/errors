function makeTransformErrors({ immutable }) {
  return function transformErrors(errors, ignoreTransforms) {
    return immutable.Map(errors).reduce((map, value, key) => {
      if (ignoreTransforms.length !== 0 && ignoreTransforms.indexOf(key) !== -1)
        return map.set(key, value);
      if (isObject(value)) return map.set(key, flattenObj(value).join(' '));
      else return map.set(key, flattenComplexArray(value).join(' '));
    }, immutable.Map());

    function flattenArray(array) {
      return array
        .reduce((set, value) => {
          return set.add(addDot(value));
        }, immutable.Set())
        .flatten();
    }

    function flattenObj(obj) {
      return Object.values(obj)
        .reduce((set, value) => {
          return isObject(value)
            ? set.add(flattenObj(value))
            : set.add(flattenArray(value));
        }, immutable.Set())
        .flatten();
    }

    function flattenComplexArray(array) {
      return array
        .reduce((set, value) => {
          if (isObject(value)) return set.add(flattenObj(value));
          return set.add(addDot(value));
        }, immutable.Set())
        .flatten();
    }

    function addDot(str) {
      return `${str}.`;
    }

    function isObject(val) {
      return val && typeof val === 'object' && !Array.isArray(val);
    }
  };
}

module.exports = makeTransformErrors;
