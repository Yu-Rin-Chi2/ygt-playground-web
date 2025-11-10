# LINEミニアプリ - QRコードリーダー

LINEミニアプリ（LIFF）でQRコードをスキャンする機能を実装したWebアプリケーションです。

## 機能

- ボタンをクリックしてQRコードをスキャン
- 読み取ったQRコードの内容を画面に表示
- エラーハンドリング（カメラ権限、キャンセル等）
- レスポンシブデザイン対応

## セットアップ手順

### 1. LINE Developersコンソールでの設定

#### 1.1 LINEログインチャネルの作成/選択

1. [LINE Developers Console](https://developers.line.biz/console/)にログイン
2. プロバイダーを選択または新規作成
3. LINEログインチャネルを選択、または新規作成

#### 1.2 LIFFアプリの登録

1. チャネル画面で「LIFF」タブをクリック
2. 「追加」ボタンをクリック
3. 以下の情報を入力：
   - **LIFFアプリ名**: 任意の名前（例: QRコードリーダー）
     - ⚠️ 「LINE」に類する文字列は使用不可
   - **サイズ**: `Full`を推奨（Compact/Tall/Fullから選択）
   - **エンドポイントURL**: アプリをホスティングするURL
     - ⚠️ HTTPS必須
     - 例: `https://yourdomain.com/line-qr/index.html`
   - **Scope**: `profile`と`openid`を選択
   - **Bot連携**: 任意
   - **Scan QR**: ✅ **必ずオンにする**（重要！）
     - このオプションをオンにしないと`liff.scanCodeV2()`が動作しません

4. 「追加」ボタンをクリック
5. 生成された **LIFF ID** をコピー（形式: `1234567890-AbcdEfgh`）

### 2. アプリケーションの設定

#### 2.1 LIFF IDの設定

`app.js`ファイルを開き、以下の部分を編集：

```javascript
// TODO: ここにLINE Developersコンソールで取得したLIFF IDを設定してください
const LIFF_ID = 'YOUR_LIFF_ID_HERE';
```

↓ 以下のように変更（コピーしたLIFF IDを貼り付け）

```javascript
const LIFF_ID = '1234567890-AbcdEfgh';  // あなたのLIFF IDに置き換え
```

#### 2.2 アプリのホスティング

1. `index.html`をWebサーバーにアップロード
2. HTTPSでアクセス可能にする
   - ローカル開発の場合: [ngrok](https://ngrok.com/)などを使用してHTTPSトンネルを作成
   - 本番環境: GitHub Pages、Netlify、Vercel等のホスティングサービス

**ローカル開発例（ngrok使用）:**

```bash
# index.htmlがあるディレクトリで簡易HTTPサーバーを起動
python -m http.server 8000

# 別のターミナルでngrokを起動
ngrok http 8000
```

生成されたHTTPS URL（例: `https://abcd1234.ngrok.io`）をLIFFのエンドポイントURLに設定します。

### 3. 動作確認

1. LINEアプリで「LIFF URL」を開く
   - LIFF URL: `https://liff.line.me/{YOUR_LIFF_ID}`
   - LINE Developersコンソールの「LIFF」タブで確認可能
2. 初回アクセス時、LINEログインを求められる場合があります
3. 「QRコードをスキャン」ボタンをクリック
4. QRコードを読み取る
5. 読み取った内容が画面に表示されることを確認

## 技術仕様

### 使用技術

- **LIFF SDK**: v2.x（最新版）
- **API**: `liff.scanCodeV2()` - QRコードスキャナー
- **対応環境**:
  - iOS 14.3以降のLIFFブラウザ
  - Android版LIFFブラウザ
  - 外部ブラウザ（WebRTC API対応）

### ファイル構成

```
line-qr/
├── index.html    # HTMLマークアップ
├── style.css     # スタイルシート
├── app.js        # JavaScript（LIFF処理）
└── README.md     # このファイル
```

## トラブルシューティング

### 「LIFF IDが設定されていません」エラー

**原因**: `app.js`内の`LIFF_ID`が`YOUR_LIFF_ID_HERE`のまま

**解決方法**: `app.js`を編集してLIFF IDを正しく設定

### 「設定エラー: Scan QRをオンにしてください」エラー

**原因**: LINE Developersコンソールで「Scan QR」がオフになっている

**解決方法**:
1. LINE Developersコンソールを開く
2. 「LIFF」タブ → 該当のLIFFアプリを選択
3. 「編集」ボタンをクリック
4. 「Scan QR」をオンにする
5. 「更新」ボタンをクリック

### 「カメラの使用が許可されていません」エラー

**原因**: ブラウザまたはLINEアプリのカメラ権限が拒否されている

**解決方法**:
- LINEアプリの設定でカメラ権限を許可
- ブラウザの設定でカメラ権限を許可

### QRコードが読み取れない

**原因**: QRコードの品質、照明条件、カメラの問題

**解決方法**:
- QRコードをカメラの中心に配置
- 十分な明るさを確保
- QRコードが鮮明であることを確認

## 参考リンク

- [LIFF公式ドキュメント](https://developers.line.biz/ja/docs/liff/overview/)
- [LIFF APIリファレンス](https://developers.line.biz/ja/reference/liff/)
- [LIFFアプリの登録方法](https://developers.line.biz/ja/docs/liff/registering-liff-apps/)
- [liff.scanCodeV2() リファレンス](https://developers.line.biz/ja/reference/liff/#scan-code-v2)

## ライセンス

このプロジェクトは自由に使用・改変できます。
