import path from "path";
import {
  Configuration,
  webpack,
  Stats,
  Compiler,
  ContextReplacementPlugin,
} from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import dotenv from "dotenv";

dotenv.config();

const outputPath = path.resolve(__dirname, "dist");

const config: Configuration = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: outputPath,
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    alias: {
      // tsconfig.json에서 설정한것과 동일해야함.
      "@src": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    // moment.js에서 한국 로캘만 사용하도록 설정
    new ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
  ],
};

// 웹팩 실행 이후에 번들 분석을 실행하는 스크립트를 추가.
if (process.env.ANALYZE === "true") {
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    if (err || !stats || stats.hasErrors()) {
      console.error(err || "웹팩 통계 정보가 없습니다.");
      return;
    }
    console.log("웹팩 빌드가 완료, 번들 분석기 실행 중.");

    // 번들 분석기를 생성할 때 compiler 객체를 직접 전달하지 않습니다.
    const analyzer = new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: path.resolve(__dirname, "report.html"),
      openAnalyzer: false,
      statsFilename: path.resolve(__dirname, "dist", "stats.json"),
    });

    // 웹팩에서 Compiler 객체를 가져옵니다.
    const webpackCompiler = webpack(config) as Compiler;

    // 번들 분석을 실행합니다.
    analyzer.apply(webpackCompiler);

    const statsJson = stats.toJson({ source: false }) as Stats;
    analyzer.generateStatsFile(statsJson);
    analyzer.generateStaticReport(statsJson); // stats 객체 전달
    console.log("번들 분석기 보고서가 생성");
  });
}

export default config;
