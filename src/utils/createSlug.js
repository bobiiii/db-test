const createSlug = (name) => name
  .trim()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '-')
  .replace(/-+/g, '-')
  .toUpperCase();

module.exports = {
  createSlug,
};
