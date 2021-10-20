const columns = (data, hasWidth = false) => {
  let columns = [];
  data.showFields.map(item => {
    let column = {};
    column.label = data.fieldNameDictionary[item];
    column.prop = item;

    column.width =
      data.userCustomizeWidthDictionary &&
      data.userCustomizeWidthDictionary[item]
        ? data.userCustomizeWidthDictionary[item]
        : data.width
        ? data.width[item]
        : hasWidth
        ? (column.label.length + 1) * 21
        : null;
    column.sort = data.orderByDictionary[item] ? true : false;
    columns.push(column);
  });
  return columns;
};
export default columns;
