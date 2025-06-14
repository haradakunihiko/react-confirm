# Publishing Setup Guide (公開設定ガイド)

このドキュメントは、**初回セットアップ時に手動で行う必要のある設定手順**です。

> **📝 注意**: 一度設定が完了すれば、その後のリリースはGitHub Actionsで自動化されます。自動リリースについては [RELEASE_PROCESS.md](RELEASE_PROCESS.md) を参照してください。

## セットアップが必要な場合

- 新しいnpmパッケージプロジェクトの初回セットアップ
- GitHub Actions による自動公開の準備
- npm registry への初回パッケージ登録

## 必要な事前準備

### 1. npm アカウントの準備

**npm アカウントが必要です：**

1. **アカウント作成**
   - [npm](https://www.npmjs.com/) でアカウント作成
   - または既存のnpm アカウントを使用

2. **パッケージ名の確認**
   - `npm search react-confirm` でパッケージ名の重複を確認
   - 既存パッケージと名前が重複していないことを確認

### 2. npm Access Token の取得

**自動公開用のトークンを取得します：**

1. **npm にログイン**
   - [npm](https://www.npmjs.com/) にログイン

2. **Access Token を作成**
   - プロフィール → Access Tokens → Generate New Token
   - Token Type: **Automation** を選択（CI/CD用）
   - Token名を入力（例: "GitHub Actions"）
   - "Generate Token" をクリック

3. **トークンをコピー**
   - 生成されたトークンをコピーして安全な場所に保存
   - ⚠️ **重要**: このトークンは一度しか表示されません

## GitHub Repository のシークレット設定

**GitHub Repository に認証情報を設定します：**

1. **GitHub Repository の設定ページにアクセス**
   - GitHubの該当リポジトリページに移動
   - "Settings" タブをクリック

2. **Secrets and variables の設定**
   - 左メニューから "Secrets and variables" → "Actions" をクリック

3. **Repository secret の追加**
   
   **必須シークレット1: npm Token**
   - "New repository secret" をクリック
   - **Name**: `NPM_TOKEN`
   - **Value**: 上記で取得したnpm Access Token
   - "Add secret" をクリック
   
   **必須シークレット2: GitHub Personal Access Token**
   - "New repository secret" をクリック
   - **Name**: `PAT_TOKEN`
   - **Value**: GitHubのPersonal Access Token (repo権限必要)
   - "Add secret" をクリック
   
   > **📝 PAT_TOKENが必要な理由:**
   > GitHub Actionsワークフローが作成するPull Requestに対してCI（テストワークフロー）を自動実行するため、デフォルトの`GITHUB_TOKEN`では権限が不足します。`PAT_TOKEN`を使用することで、ワークフローが作成したPRでも他のワークフローが正常に動作します。
   
   > **📝 GitHub Personal Access Tokenの取得方法:**
   > 1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   > 2. "Generate new token" → "Generate new token (classic)"
   > 3. スコープで "repo" を選択
   > 4. 生成されたトークンをコピー

## 初回パッケージ公開（手動）

**⚠️ 重要**: npm パッケージの初回公開は手動で行う必要があります。

```bash
# 依存関係のインストール
npm ci

# テスト実行
npm test

# パッケージビルド
npm run build

# 初回公開
npm publish --access public
```

> **📝 注意**: 
> - `--access public` は必須です（スコープ付きパッケージをパブリックにするため）
> - 初回公開後は、GitHub Actionsが自動的に後続のバージョンを公開します

## パッケージの可視性設定

初回公開後、npm上でパッケージ設定を確認：

1. **[npm](https://www.npmjs.com/) にログイン**
2. **Your Packages でパッケージを選択**
3. **Settings タブで設定確認**
   - Visibility: Public
   - Publish access: Maintainers only（推奨）

## セットアップ完了後

**全ての設定が完了すると：**

- ✅ GitHub Actions による自動リリースが利用可能
- ✅ npm registry への自動公開が有効
- ✅ [RELEASE_PROCESS.md](RELEASE_PROCESS.md) の手順でリリース実行可能

## トラブルシューティング

### 手動での動作確認

**緊急時やテスト目的でローカルから手動公開する場合：**

```bash
# npm にログイン
npm login

# パッケージをテスト公開（実際には公開されない）
npm publish --dry-run

# 実際の公開
npm publish --access public
```

> **⚠️ セキュリティ注意**: npm Access Token はローカル環境でのみ使用し、リポジトリにコミットしないでください。

### よくあるエラー

**公開権限エラー:**
```
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/react-confirm - you must verify your email to publish packages
```
→ npm アカウントのメール認証が必要です

**パッケージ名重複エラー:**
```
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/react-confirm - package name too similar to existing packages
```
→ package.json の name フィールドを変更してください

**認証エラー:**
```
npm ERR! 401 Unauthorized - PUT https://registry.npmjs.org/react-confirm
```
→ NPM_TOKEN が正しく設定されているか確認してください

## 関連ドキュメント

- **自動リリース**: [RELEASE_PROCESS.md](RELEASE_PROCESS.md) - セットアップ完了後の自動リリースプロセス
- **npm公式ドキュメント**: [Publishing packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- **GitHub Actions設定**: `.github/workflows/` ディレクトリ内の各ワークフローファイル
