// Transform data
// Trim empty empty spaces
// Deal with null values
// Convert invalid ages/salaries to numeric values

module.exports = {
  trimSpaces: (item) => {
    return item.trim(); // Clean the value for empty leading/trailing spaces
  },

  replaceInvalid: (item) => {
    return String(item).trim() === "" || item === 'invalid' ? "unknown" : item; // If item is an empty string or given as invalid, replace it with unknown
  },

  convertToNumber: (item) => {
    return isNaN(Number(item)) ? item : Number(item); // Try to coerce the string to a number, if it returns NaN, return the item otherwise coerce it to a string
  },
};
