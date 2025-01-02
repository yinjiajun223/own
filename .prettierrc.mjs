/** @type {import("prettier").Config} */
export default {
  // 启用 Astro 文件的格式化支持
  plugins: ["prettier-plugin-astro"],

  // 缩进使用 2 个空格
  tabWidth: 2,

  // 在语句末尾添加分号
  semi: true,

  // 使用双引号而不是单引号
  singleQuote: false,

  // 每行代码最大长度为 150 个字符
  printWidth: 150,

  // 在对象或数组末尾添加逗号（ES5 风格）
  trailingComma: "es5",

  // 特定文件类型的覆盖配置
  overrides: [
    {
      // 针对 .astro 文件的配置
      files: "*.astro",
      options: {
        // 指定使用 astro 解析器来处理 .astro 文件
        parser: "astro",
      },
    },
  ],
};
