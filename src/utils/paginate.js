const calculateLimitAndOffset = (currentPage, pageLimit = 20) => {
  const offset = (currentPage ? Number(currentPage) - 1 : 0) * Number(pageLimit);
  const limit = Number(pageLimit);
  return { offset, limit };
};

const paginate = (currentPage, count, rows, pageLimit = 20) => {
  const meta = {
    currentPage: Number(currentPage) || 1,
    pageCount: Math.ceil(count / Number(pageLimit)),
    pageSize: rows.length,
    count
  };
  return meta;
};

module.exports = { calculateLimitAndOffset, paginate }
