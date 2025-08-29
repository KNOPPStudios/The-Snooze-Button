const pluginRSS = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Markdown with raw HTML allowed
  eleventyConfig.setLibrary("md", markdownIt({ html: true, linkify: true }));

  // Passthroughs (this is the key so /admin/config.yml is NOT 404)
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy({ "images": "images", "css": "css", "scripts": "scripts" });

  // Posts collection
  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByGlob("src/posts/**/*.md").sort((a,b) => b.date - a.date)
  );

  // Date filter
  eleventyConfig.addNunjucksFilter("date", (value, format = "MMMM d, yyyy") => {
    const dt = value instanceof Date ? DateTime.fromJSDate(value) : DateTime.fromJSDate(new Date(value));
    return dt.isValid ? dt.toFormat(format) : "";
    });

  // Plugins
  eleventyConfig.addPlugin(pluginRSS);

  return {
    dir: { input: ".", includes: "src/_includes", data: "src/_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
