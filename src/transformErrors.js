function makeTransformErrors({ immutable }) {
  return function transformErrors(errors) {
    const out = immutable.Map(errors).reduce((map, value, key) => {
      if (isObject(value)) return map.set(key, flattenSingleObj(value));
      else return map.set(key, flattenComplexArray(value));
    }, immutable.Map());

    console.log(out.toJS());

    function flattenArray(array) {
      return array
        .reduce((set, value) => {
          return set.add(addDot(value));
        }, immutable.Set())
        .join(' ');
    }

    function flattenSingleObj(obj) {
      return Object.values(obj)
        .reduce((set, value) => {
          return set.add(flattenArray(value));
        }, immutable.Set())
        .join(' ');
    }

    function flattenComplexArray(array) {
      return array
        .reduce((set, value) => {
          if (isObject(value)) return set.add(flattenSingleObj(value));
          return set.add(addDot(str));
        }, immutable.Set())
        .join(' ');
    }

    function addDot(str) {
      return `${str}.`;
    }

    function isEmptyObj(obj) {
      return isObject(obj) && Object.keys(obj).length === 0;
    }

    function isObject(val) {
      return val && typeof val === 'object' && !Array.isArray(val);
    }
  };
}

module.exports = makeTransformErrors;
