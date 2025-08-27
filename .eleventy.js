const pluginRSS = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  eleventyConfig.setLibrary("md", markdownIt({ html: true, linkify: true }));
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});

  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByGlob("src/posts/**/*.md").sort((a,b) => b.date - a.date)
  );

  eleventyConfig.addFilter("related", (post, allPosts, max = 3) => {
    const tags = new Set((post.data.tags || []).filter(t => !["post","posts"].includes(t)));
    const scored = allPosts.filter(p => p.url !== post.url).map(p => {
      const ptags = new Set(p.data.tags || []); let score = 0;
      tags.forEach(t => { if (ptags.has(t)) score += 1; });
      return { p, score, date: p.date };
    }).sort((a,b) => (b.score - a.score) || (b.date - a.date));
    const top = scored.filter(x=>x.score>0).slice(0,max).map(x=>x.p);
    for (const p of allPosts) { if (top.length>=max) break;
      if (p.url!==post.url && !top.find(t=>t.url===p.url)) top.push(p); }
    return top.slice(0,max);
  });

  return {
    dir: { input: ".", includes: "src/_includes", data: "src/_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
