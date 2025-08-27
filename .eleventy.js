const pluginRSS = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Markdown: allow raw HTML for embeds (Captivate etc.)
  eleventyConfig.setLibrary("md", markdownIt({ html: true, linkify: true }));

  // Static assets passthrough (make folder if/when you need it)
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});

  // near your other passthroughs
  eleventyConfig.addPassthroughCopy("admin");

  // Collections
  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByGlob("src/posts/**/*.md").sort((a,b) => b.date - a.date)
  );

  // Related posts (by tag overlap, then newest)
  eleventyConfig.addFilter("related", (post, allPosts, max = 3) => {
    const tags = new Set((post.data.tags || []).filter(t => !["post","posts"].includes(t)));
    const scored = allPosts.filter(p => p.url !== post.url).map(p => {
      const ptags = new Set(p.data.tags || []);
      let score = 0;
      tags.forEach(t => { if (ptags.has(t)) score += 1; });
      return { p, score, date: p.date };
    }).sort((a,b) => (b.score - a.score) || (b.date - a.date));
    const top = scored.filter(x => x.score > 0).slice(0, max).map(x => x.p);
    for (const p of allPosts) {
      if (top.length >= max) break;
      if (p.url !== post.url && !top.find(t => t.url === p.url)) top.push(p);
    }
    return top.slice(0, max);
  });

  // Nunjucks date filter: {{ someDate | date("MMMM d, yyyy") }}
  eleventyConfig.addNunjucksFilter("date", (value, format = "MMMM d, yyyy") => {
    const dt = value instanceof Date ? DateTime.fromJSDate(value) : DateTime.fromJSDate(new Date(value));
    if (!dt.isValid) return "";
    return dt.toFormat(format);
  });

  // Shortcode for current year: {% year %}
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  // Plugins
  eleventyConfig.addPlugin(pluginRSS);

  // Directories
  return {
    dir: { input: ".", includes: "src/_includes", data: "src/_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
