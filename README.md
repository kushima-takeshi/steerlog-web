# SteerLog Web

SteerLog のフロントエンド（React + TypeScript + Vite）です。  
バックエンド API は別リポジトリ [`steerlog-api`](https://github.com/kushima-takeshi/steerlog-api) を使います。

実装計画の正本は API リポジトリ側の `docs/12-frontend-plan.md` です。

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開く。

API を使うときは、別ターミナルで `steerlog-api` を起動しておく。

```bash
# steerlog-api 側
docker compose up -d
mvn spring-boot:run
```

## 環境変数

`.env.example` を参考に `.env` を作成する。

```bash
cp .env.example .env
```

## スクリプト

| コマンド | 内容 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run preview` | ビルド結果の確認 |

## 現在地

- [x] Phase 0: プロジェクト箱（Vite + React + TS）
- [ ] Phase 1: API 疎通
- [ ] Phase 2: 認証
- [ ] Phase 3: 教材一覧・作成
