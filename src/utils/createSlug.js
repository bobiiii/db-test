const createSlug = (name) => name
  .trim()
  .replace(/\s+/g, '-')
  .replace(/[^a-zA-Z0-9-?]/g, '-')
  .replace(/\?/g, '')
  .replace(/-+/g, '-')
  .replace(/-+$/, '')
  .toLowerCase();

module.exports = {
  createSlug,
};
