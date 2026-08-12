# SteerLog Web

SteerLog のフロントエンド用リポジトリです。  
バックエンド API: https://github.com/kushima-takeshi/steerlog-api

実装計画の正本: `steerlog-api` の [`docs/12-frontend-plan.md`](https://github.com/kushima-takeshi/steerlog-api/blob/main/docs/12-frontend-plan.md)

## 技術スタック

- React + TypeScript
- Vite
- React Router（Phase 6 から）
- fetch（認証付きリクエストは `src/api/client.ts`）

## 現在地

- [x] Phase 0: Vite + React + TS プロジェクト
- [x] Phase 1: API 疎通
- [x] Phase 2: 登録 / ログイン / JWT 保存
- [x] Phase 3: 教材一覧 + 作成
- [x] Phase 4: リソース詳細（統合詳細 API）
- [x] Phase 5: 学習フロー（振り返り IMMEDIATE_REFLECTION）
- [x] Phase 6: 画面分割（React Router）
- [ ] Phase 7: UI 改善（モック）

### ルート（Phase 6）

| パス | 画面 |
|------|------|
| `/` | リダイレクト（未ログイン → `/login`、ログイン済み → `/resources`） |
| `/login` | 登録 / ログイン |
| `/resources` | 教材一覧 + 作成 |
| `/resources/:resourceId` | 教材詳細 |
| `/resources/:resourceId/reflection` | 振り返りフロー |

詳細は [`docs/12-frontend-plan.md`](https://github.com/kushima-takeshi/steerlog-api/blob/main/docs/12-frontend-plan.md) の Phase 7〜8 を参照。

## セットアップ

```bash
cd steerlog-web
npm install
cp .env.example .env
npm run dev
```

http://localhost:5173 で開きます。

## 環境変数

`.env.example` をコピーして `.env` を作成してください。

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## API の起動（別リポジトリ）

フロント単体では API は動きません。`steerlog-api` を起動してください。

```bash
cd steerlog-api
docker compose up -d
mvn spring-boot:run
```

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run lint` | ESLint |
| `npm run preview` | ビルド結果のプレビュー |
