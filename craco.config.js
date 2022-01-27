const path = require("path");

const generateAliases = (prefix = "src") => ({
  "@": `${prefix}`,
  "@/components": `${prefix}/components`,
  "@/lib": `${prefix}/lib`,
  "@/pages": `${prefix}/pages`,
  "@/redux": `${prefix}/redux`,
});

const SRC = "./src";
const aliases = generateAliases(SRC);

const resolvedAliases = Object.fromEntries(
  Object.entries(aliases).map(([key, value]) => [
    key,
    path.resolve(__dirname, value),
  ]),
);

module.exports = {
  webpack: {
    alias: resolvedAliases,
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        pathRewrite: { "^/api": "" },
      },
    },
  },
};
