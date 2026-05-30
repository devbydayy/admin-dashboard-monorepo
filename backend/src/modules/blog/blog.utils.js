const slugify = require('slugify');

module.exports.generateSlug = (title) => {
  return slugify(title, { lower: true, strict: true });
};

module.exports.parseMarkdown = (content) => {
  return { html: content.replace(/\n/g, '<br>') };
};