// LINEミニアプリのLIFF ID
const LIFF_ID = '2008462578-r47b8axl';

// DOM要素
const scanButton = document.getElementById('scanButton');
const resultArea = document.getElementById('resultArea');
const resultContent = document.getElementById('resultContent');
const errorMessage = document.getElementById('errorMessage');
const status = document.getElementById('status');

/**
 * エラーメッセージを表示
 * @param {string} message - 表示するエラーメッセージ
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    resultArea.classList.remove('show');
}

/**
 * 結果を表示
 * @param {string} text - 表示するテキスト
 */
function showResult(text) {
    resultContent.textContent = text;
    resultArea.classList.add('show');
    errorMessage.classList.remove('show');
}

/**
 * ステータスメッセージを表示
 * @param {string} message - 表示するメッセージ
 * @param {boolean} isLoading - ローディングアイコンを表示するか
 */
function showStatus(message, isLoading = false) {
    status.innerHTML = message + (isLoading ? '<span class="loading"></span>' : '');
}

/**
 * QRコードスキャン処理
 */
async function scanQRCode() {
    try {
        showStatus('QRコードリーダーを起動中', true);
        scanButton.disabled = true;
        errorMessage.classList.remove('show');

        // QRコードスキャナーを起動
        const result = await liff.scanCodeV2();

        showStatus('スキャン成功！');
        showResult(result.value);

    } catch (error) {
        console.error('QRコードスキャンエラー:', error);
        showStatus('');

        if (error.code === 'INVALID_CONFIG') {
            showError('設定エラー: LINE Developersコンソールで「Scan QR」をオンにしてください');
        } else if (error.code === 'USER_CANCEL') {
            showError('スキャンがキャンセルされました');
        } else if (error.code === 'CAMERA_PERMISSION_DENIED') {
            showError('カメラの使用が許可されていません');
        } else {
            showError(`エラーが発生しました: ${error.message || 'QRコードの読み取りに失敗しました'}`);
        }
    } finally {
        scanButton.disabled = false;
    }
}

/**
 * LIFF初期化
 */
async function initializeLiff() {
    try {
        showStatus('LIFF初期化中', true);

        // LIFF IDのチェック
        if (LIFF_ID === 'YOUR_LIFF_ID_HERE') {
            showError('LIFF IDが設定されていません。app.jsの「LIFF_ID」変数にLIFF IDを設定してください。');
            scanButton.disabled = true;
            return;
        }

        // LIFF初期化
        await liff.init({ liffId: LIFF_ID });

        // ログイン状態チェック
        if (!liff.isLoggedIn()) {
            showStatus('LINEログイン中', true);
            liff.login();
            return;
        }

        showStatus('準備完了！QRコードをスキャンできます');
        scanButton.disabled = false;

    } catch (error) {
        console.error('LIFF初期化エラー:', error);
        showError(`初期化エラー: ${error.message}`);
        scanButton.disabled = true;
    }
}

// イベントリスナー
scanButton.addEventListener('click', scanQRCode);
window.addEventListener('load', initializeLiff);
