function makeTransformErrors({ Immutable }) {
  return function transformErrors(errors, ignoreTransforms) {
    return errors.reduce((map, value, key) => {
      if (ignoreTransforms.length !== 0 && ignoreTransforms.indexOf(key) !== -1)
        return map.set(key, ignoreFlatten(value, isList(value)));
      if (isList(value)) return map.set(key, flattenList(value).join(' '));
      else return map.set(key, flattenMap(value).join(' '));
    }, Immutable.Map());

    function ignoreFlatten(values, ifList) {
      return values.reduce(
        (reducer, value, key) => {
          return isList(value)
            ? reducer.set(key, flattenList(value).join(' '))
            : reducer.set(key, ignoreFlatten(value, isList(value)));
        },
        ifList ? Immutable.List() : Immutable.Map()
      );
    }

    function flattenList(list) {
      return list
        .reduce((set, value) => {
          return isMap(value)
            ? set.add(flattenMap(value))
            : set.add(addDot(value));
        }, Immutable.Set())
        .flatten();
    }

    function flattenMap(map) {
      return map
        .reduce((set, value) => {
          if (isMap(value)) return set.add(flattenMap(value));
          else return set.add(flattenList(value));
        }, Immutable.Set())
        .flatten();
    }

    function addDot(str) {
      return `${str}.`;
    }

    function isList(val) {
      return Immutable.List.isList(val);
    }

    function isMap(val) {
      return Immutable.Map.isMap(val);
    }
  };
}

module.exports = makeTransformErrors;
