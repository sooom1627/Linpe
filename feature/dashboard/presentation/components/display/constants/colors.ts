/**
 * Dashboard関連の統一された色定義
 * チャートやグラフで共通して使用するシンプルな色
 */

// 画面のUIに合わせたシンプルな色定義
export const colors = {
  // アクティビティタイプの色
  add: {
    main: "#313134", // ダークグレー - 一番暗い
    light: "rgba(49, 49, 52, 0.9)",
    dark: {
      main: "#E2E2E2",
      light: "rgba(226, 226, 226, 0.9)",
    },
  },
  swipe: {
    main: "#6B6B70", // ミディアムグレー - 中間の暗さ
    light: "rgba(107, 107, 112, 0.9)",
    dark: {
      main: "#ADADB2",
      light: "rgba(173, 173, 178, 0.9)",
    },
  },
  read: {
    main: "#A9A9AE", // ライトグレー - 一番明るい
    light: "rgba(169, 169, 174, 0.9)",
    dark: {
      main: "#7F7F84",
      light: "rgba(127, 127, 132, 0.9)",
    },
  },

  // UI要素
  grid: {
    line: "rgba(169, 169, 174, 0.2)", // とても薄いグレー（グリッド線用）
    dark: {
      line: "rgba(226, 226, 226, 0.2)",
    },
  },
};
