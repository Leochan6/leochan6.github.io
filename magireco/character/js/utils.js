const utils = (() => {

  let module = {};

  module.sortArrayBy = (a, b, sortBy) => {
    let i = 0,
      result = 0;
    while (i < sortBy.length && result === 0) {
      if (sortBy[i].isString) result = sortBy[i].direction * (a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
      else result = sortBy[i].direction * (parseInt((a[sortBy[i].prop]).toString()) < parseInt((b[sortBy[i].prop]).toString()) ? -1 : (parseInt((a[sortBy[i].prop]).toString()) > parseInt((b[sortBy[i].prop]).toString()) ? 1 : 0));
      i++;
    }
    return result;
  };

  return module;
})();