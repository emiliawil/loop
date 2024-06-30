const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {

  eleventyConfig.setTemplateFormats([
    "md",
    "njk",
    "html",
    "liquid"
  ]);

  // Set Nunjucks as the engine for .njk files
  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    autoescape: false,
  });


  // Add a dateToISO filter
  eleventyConfig.addFilter("dateToISO", (date) => {
    return DateTime.fromJSDate(date).toISO();
  });

  // Add a readableDate filter
  eleventyConfig.addFilter("readableDate", (date) => {
    return DateTime.fromJSDate(date).toFormat("d LLLL yyyy");
  });

  eleventyConfig.addPassthroughCopy("./src/css/");
  eleventyConfig.addWatchTarget("./src/css/");

  eleventyConfig.addPassthroughCopy({"src/assets/images": "images"});

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("date", function(date, format) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return DateTime.fromJSDate(date, {zone: 'utc'}).toFormat(format);
  });

  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tagsSet = new Set();
    collectionApi.getAll().forEach(item => {
      if ("tags" in item.data) {
        item.data.tags.filter(tag => !["post", "all"].includes(tag)).forEach(tag => tagsSet.add(tag));
      }
    });
    return [...tagsSet].sort();
  });

  eleventyConfig.addCollection("navItems", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/*.md")
  });

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/blog/posts/*.md");
  });

  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/projects/games/*.md");
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
