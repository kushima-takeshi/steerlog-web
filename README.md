# SteerLog Web

SteerLog のフロントエンド用リポジトリです。  
バックエンドは別リポジトリ: https://github.com/kushima-takeshi/steerlog-api

実装計画の正本: `steerlog-api` の `docs/12-frontend-plan.md`

## 現在地

Phase 0 は **自分で作成する前提** です（雛形は入れていません）。

## Phase 0（自分でやる手順）

ターミナルでこのディレクトリに移動してから実行します。

```bash
cd ~/Desktop/steerlog-web
```

### 1. Vite + React + TypeScript プロジェクトを作る

空の git リポジトリの中に作るので、次のようにします。

```bash
npm create vite@latest . -- --template react-ts
```

聞かれたらそのまま進めて OK です。

### 2. 依存関係を入れる

```bash
npm install
```

### 3. 起動して確認する

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開き、Vite の初期画面が出れば成功です。

### 4. 画面を SteerLog にする（任意・最初の練習）

`src/App.tsx` を開いて、見出しを `SteerLog` に変えてみましょう。  
保存すると画面が自動で更新されます（HMR）。

### 5. できたらコミットする

```bash
git add -A
git commit -m "chore: bootstrap Vite React TypeScript app"
git push
```

## 次（Phase 1）

API 疎通です。詰まったら `docs/12-frontend-plan.md` を見ながら相談してください。

## API 側の起動（後で使う）

```bash
# steerlog-api 側
docker compose up -d
mvn spring-boot:run
```
