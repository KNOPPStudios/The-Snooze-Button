const pluginRSS = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Markdown with raw HTML allowed (for embeds)
  eleventyConfig.setLibrary("md", markdownIt({ html: true, linkify: true }));

  // Passthroughs
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy({ "css": "css", "js": "js", "images": "images", "scripts": "scripts" });

  // Collections
  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByGlob("src/posts/**/*.md").sort((a,b) => b.date - a.date)
  );

  // Nunjucks date filter
  eleventyConfig.addNunjucksFilter("date", (value, format = "MMMM d, yyyy") => {
    const dt = value instanceof Date ? DateTime.fromJSDate(value) : DateTime.fromJSDate(new Date(value));
    if (!dt.isValid) return "";
    return dt.toFormat(format);
  });

  eleventyConfig.addPlugin(pluginRSS);

  return {
    dir: { input: ".", includes: "src/_includes", data: "src/_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
