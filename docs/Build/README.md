# Unity WebGL ビルドファイルの配置場所

このフォルダに、Unity で生成した WebGL（無圧縮）ビルドファイルを配置してください。

## 📁 必要なファイル

Unity で WebGL ビルドを実行すると、以下のファイルが生成されます：

```
Build/
├── Build.loader.js          # Unity ローダー
├── Build.framework.js       # Unity フレームワーク
├── Build.wasm              # WebAssembly バイナリ
└── Build.data              # ゲームデータ
```

## 🔧 Unity 側のビルド設定

### 1. Build Settings

1. **File → Build Settings**
2. **Platform** を **WebGL** に切り替え
3. **Switch Platform** をクリック

### 2. Player Settings

1. **Player Settings** をクリック
2. **Publishing Settings** セクションを開く
3. **Compression Format** を **Disabled** に設定（無圧縮）
   - ⚠️ これが重要！圧縮形式だと LINE ミニアプリで動作しない場合があります

### 3. ビルド実行

1. **Build** ボタンをクリック
2. このフォルダ（`docs/Build/`）を選択
3. ビルドが完了すると、上記のファイルが自動生成されます

## 📝 ファイル名について

`unity.html` では、以下のファイル名を想定しています：

- `Build.loader.js`
- `Build.framework.js`
- `Build.wasm`
- `Build.data`

Unity 側でビルド時に別の名前を付けた場合は、`unity.html` の以下の部分を修正してください：

```javascript
const buildUrl = "Build";
const config = {
  dataUrl: buildUrl + "/Build.data", // ← ファイル名を変更
  frameworkUrl: buildUrl + "/Build.framework.js", // ← ファイル名を変更
  codeUrl: buildUrl + "/Build.wasm", // ← ファイル名を変更
  // ...
};
```

## ⚠️ 注意事項

- ビルドファイルは **Git にコミットしない**ことを推奨（ファイルサイズが大きいため）
- GitHub Pages の容量制限（1GB）に注意
- 本番環境では、CDN やストレージサービスの利用も検討してください
