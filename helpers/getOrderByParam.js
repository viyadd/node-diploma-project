

 /**
	* Преобразует строковый параметр для сортировки в число
	*
	* @param {'asc'|'desc'} orderBy
	* @returns {number}
	*/
 function getOrderByParam(orderBy) {
	let orderByParam;

	switch (orderBy) {
		case 'asc':
			orderByParam = 1;
			break;
		case 'desc':
			orderByParam = -1;
			break
		default:
			orderByParam = 0;
	}
	return orderByParam
}

module.exports = getOrderByParam
