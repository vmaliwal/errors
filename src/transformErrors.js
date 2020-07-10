function makeTransformErrors({ Immutable }) {
  return function transformErrors(errors, ignoreTransforms) {
    return Immutable.Seq(errors).reduce((map, value, key) => {
      if (ignoreTransforms.length !== 0 && ignoreTransforms.indexOf(key) !== -1)
        return map.set(key, ignoreFlatten(value, isList(value)));
      if (isList(value)) return map.set(key, flattenList(value).join(' '));
      else return map.set(key, flattenMap(value).join(' '));
    }, Immutable.Map());

    /**
     * Maintain structure of the tree and only flatten the List
     * @param {Immutable.List | Immutable.Map} values
     * @param {boolean} ifList
     * @returns {Immutable.List | Immutable.Map}
     */
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

    /**
     * Deep flattens a List & returns combined values in a set
     * @param {Immutable.List} list
     * @returns {Immutable.Set}
     */
    function flattenList(list) {
      return list
        .reduce((set, value) => {
          return isMap(value)
            ? set.add(flattenMap(value))
            : set.add(addDot(value));
        }, Immutable.Set())
        .flatten();
    }

    /**
     * Deep flattens a Map & returns combined values in a set
     * @param {Immutable.Map} map
     * @returns {Immutable.Set}
     */
    function flattenMap(map) {
      return map
        .reduce((set, value) => {
          return isMap(value)
            ? set.add(flattenMap(value))
            : set.add(flattenList(value));
        }, Immutable.Set())
        .flatten();
    }

    /**
     * Adds a dot at the end of the string
     * @param {String} str
     */
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
