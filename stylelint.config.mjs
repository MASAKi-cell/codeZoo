import stylelintConfigRecessOrder from "stylelint-config-recess-order";
import stylelintConfigStandard from "stylelint-config-standard";

export default {
  extends: [
    stylelintConfigRecessOrder, // プロパティの並び替え
    stylelintConfigStandard,
  ],
  rules: {
    "no-descending-specificity": true, // ソース順序と詳細度
    "declaration-no-important": true, // !importantの禁止
    "string-no-newline": true, // 文字列内の無効な改行を禁止
    "property-no-unknown": true, // 不明なプロパティを禁止
    "declaration-block-no-duplicate-properties": true, // 重複するプロパティを禁止
    "block-no-empty": true, // 空ブロックを禁止
    "no-duplicate-selectors": true, // 重複セレクタを禁止
    "color-no-invalid-hex": true, // 無効な 16 進カラーを禁止
    "declaration-empty-line-before": "never", // 宣言の前の空行を禁止
  },
};
