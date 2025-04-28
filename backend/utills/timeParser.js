// utils/timeParser.js
const parseDuration = (input) => {
    const match = input.match(/^(\d+)(m|h|d|mo)$/);
    if (!match) return null;
  
    const [_, value, unit] = match;
    const multiplier = {
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      mo: 30 * 24 * 60 * 60 * 1000,
    };
  
    return Date.now() + parseInt(value) * multiplier[unit];
  };
  
  module.exports = parseDuration;
  