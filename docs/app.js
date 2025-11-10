// LINEミニアプリのLIFF ID
const LIFF_ID = "2008462578-r47b8axl";

// DOM要素
const scanButton = document.getElementById("scanButton");
const resultArea = document.getElementById("resultArea");
const resultContent = document.getElementById("resultContent");
const errorMessage = document.getElementById("errorMessage");
const status = document.getElementById("status");

// Unity関連
let unityInstance = null;
let isUnityLoaded = false;

/**
 * エラーメッセージを表示
 * @param {string} message - 表示するエラーメッセージ
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  resultArea.classList.remove("show");
}

/**
 * 結果を表示
 * @param {string} text - 表示するテキスト
 */
function showResult(text) {
  resultContent.textContent = text;
  resultArea.classList.add("show");
  errorMessage.classList.remove("show");
}

/**
 * ステータスメッセージを表示
 * @param {string} message - 表示するメッセージ
 * @param {boolean} isLoading - ローディングアイコンを表示するか
 */
function showStatus(message, isLoading = false) {
  status.innerHTML =
    message + (isLoading ? '<span class="loading"></span>' : "");
}

/**
 * QRコードスキャン処理
 */
async function scanQRCode() {
  try {
    showStatus("QRコードリーダーを起動中", true);
    scanButton.disabled = true;
    errorMessage.classList.remove("show");

    // QRコードスキャナーを起動
    const result = await liff.scanCodeV2();

    showStatus("スキャン成功！");
    showResult(result.value);

    // Unityが読み込まれている場合、Unityにも結果を送信
    if (isUnityLoaded && unityInstance) {
      unityInstance.SendMessage(
        "LIFFManager",
        "OnQRCodeScanned",
        JSON.stringify({ success: true, value: result.value })
      );
    }
  } catch (error) {
    console.error("QRコードスキャンエラー:", error);
    showStatus("");

    if (error.code === "INVALID_CONFIG") {
      showError(
        "設定エラー: LINE Developersコンソールで「Scan QR」をオンにしてください"
      );
    } else if (error.code === "USER_CANCEL") {
      showError("スキャンがキャンセルされました");
    } else if (error.code === "CAMERA_PERMISSION_DENIED") {
      showError("カメラの使用が許可されていません");
    } else {
      showError(
        `エラーが発生しました: ${
          error.message || "QRコードの読み取りに失敗しました"
        }`
      );
    }
  } finally {
    scanButton.disabled = false;
  }
}

/**
 * Unity WebGLを読み込む
 */
async function loadUnity() {
  // createUnityInstance関数が存在するかチェック
  if (typeof createUnityInstance === "undefined") {
    console.log("Unity loader not found - Unity機能は無効です");
    return;
  }

  try {
    showStatus("Unity読み込み中...", true);

    const canvas = document.getElementById("unity-canvas");
    const unityContainer = document.getElementById("unity-container");
    const loadingDiv = document.getElementById("unity-loading");

    // Unityビルド設定
    const buildUrl = "Build";
    const config = {
      dataUrl: buildUrl + "/Build.data",
      frameworkUrl: buildUrl + "/Build.framework.js",
      codeUrl: buildUrl + "/Build.wasm",
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "LINEミニアプリ",
      productVersion: "1.0.0",
    };

    // Unity読み込み
    unityInstance = await createUnityInstance(canvas, config, (progress) => {
      loadingDiv.textContent = `Unity読み込み中... ${Math.round(
        progress * 100
      )}%`;
    });

    // 読み込み完了
    window.unityInstance = unityInstance;
    isUnityLoaded = true;
    loadingDiv.style.display = "none";
    unityContainer.style.display = "block";

    console.log("✅ Unity WebGL読み込み完了");
    showStatus("Unity読み込み完了");

    // UnityにLIFF初期化完了を通知
    unityInstance.SendMessage("LIFFManager", "OnLIFFInitialized", "success");
  } catch (error) {
    console.log("Unity読み込みスキップ:", error.message);
    showStatus("準備完了！QRコードをスキャンできます"); // Unityなしでも動作可能
  }
}

/**
 * LIFF初期化
 */
async function initializeLiff() {
  try {
    showStatus("LIFF初期化中", true);

    // LIFF初期化
    await liff.init({ liffId: LIFF_ID });

    // ログイン状態チェック
    if (!liff.isLoggedIn()) {
      showStatus("LINEログイン中", true);
      liff.login();
      return;
    }

    showStatus("準備完了！QRコードをスキャンできます");
    scanButton.disabled = false;

    // Unity読み込み（ビルドファイルがあれば）
    loadUnity();
  } catch (error) {
    console.error("LIFF初期化エラー:", error);
    showError(`初期化エラー: ${error.message}`);
    scanButton.disabled = true;
  }
}

// イベントリスナー
scanButton.addEventListener("click", scanQRCode);
window.addEventListener("load", initializeLiff);
