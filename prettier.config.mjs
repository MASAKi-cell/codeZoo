const config = {
  plugins: [
    /**  importの順序を指定する */
    "@ianvs/prettier-plugin-sort-imports",
  ],
  trailingComma: none /** 末尾にカンマをつけない */,
  singleQuote: true,
  semi: false,
  printWidth: 100,
};

export default config;
