// webview/view.ts
import * as path from 'path'
import * as vscode from 'vscode'
import { Cat } from '../cat'
import { cat_status_ui } from '../types/cat_type'

export const createWebviewPanel = (
  context: vscode.ExtensionContext,
  cat: Cat
): vscode.WebviewPanel => {
  const panel = vscode.window.createWebviewPanel('codezoo', 'CodeZoo', vscode.ViewColumn.Two, {
    enableScripts: true,
    retainContextWhenHidden: true,
    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'resources'))]
  })

  // リソースへのパスを取得する関数
  const getResourceUri = (fileName: string): vscode.Uri => {
    const resourcePath = path.join(context.extensionPath, 'resources', fileName)
    return panel.webview.asWebviewUri(vscode.Uri.file(resourcePath))
  }

  // 猫の状態を取得
  const catState = cat.getState()

  // Webviewの内容を設定
  panel.webview.html = getWebviewContent(catState, getResourceUri)

  // Webviewからのメッセージを処理
  panel.webview.onDidReceiveMessage(
    (message: { command: string }) => {
      switch (message.command) {
        case 'feed':
          const fedSuccess = cat.feedCat()
          if (fedSuccess) {
            vscode.window.showInformationMessage('猫に餌をあげました！')
          } else {
            vscode.window.showInformationMessage('猫は今餌を食べられません')
          }
          updateWebview(panel, cat, getResourceUri)
          break
        case 'play':
          const playSuccess = cat.playCat()
          if (playSuccess) {
            vscode.window.showInformationMessage('猫と遊びました！')
          } else {
            vscode.window.showInformationMessage('猫は今遊べる状態ではありません')
          }
          updateWebview(panel, cat, getResourceUri)
          break
        case 'wake':
          const wakeSuccess = cat.wakeUp()
          if (wakeSuccess) {
            vscode.window.showWarningMessage('猫を起こしました。好感度が下がりました。')
          }
          updateWebview(panel, cat, getResourceUri)
          break
      }
    },
    undefined,
    context.subscriptions
  )

  return panel
}

const updateWebview = (
  panel: vscode.WebviewPanel,
  cat: Cat,
  getResourceUri: (fileName: string) => vscode.Uri
): void => {
  const catState = cat.getState()
  panel.webview.html = getWebviewContent(catState, getResourceUri)
}

const getWebviewContent = (
  catState: cat_status_ui,
  getResourceUri: (fileName: string) => vscode.Uri
): string => {
  const catImage = getResourceUri(catState.imageUrl)

  return `<!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CodeZoo</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                text-align: center;
                background-color: #f5f5f5;
            }
            .container {
                max-width: 500px;
                margin: 0 auto;
                background-color: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            .cat-image {
                width: 200px;
                height: 200px;
                margin: 20px auto;
                object-fit: contain;
            }
            .status {
                display: flex;
                justify-content: space-around;
                margin: 20px 0;
            }
            .status-item {
                text-align: center;
            }
            .status-bar {
                width: 100px;
                height: 10px;
                background-color: #eee;
                border-radius: 5px;
                overflow: hidden;
                margin-top: 5px;
            }
            .status-bar-fill {
                height: 100%;
                border-radius: 5px;
            }
            .hunger-bar-fill {
                background-color: #4CAF50;
            }
            .affection-bar-fill {
                background-color: #FF4081;
            }
            .actions {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
            }
            button {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                background-color: #4CAF50;
                color: white;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            button:hover {
                background-color: #45a049;
            }
            button:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
            }
            .info {
                margin-top: 20px;
                font-style: italic;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>CodeZoo - あなたの猫</h1>
            <div class="info">
                <p>成長段階: ${catState.stageName}</p>
                <p>親密度: ${catState.affectionLevel}</p>
                <p>${catState.isSleeping ? '💤 寝ています' : '😺 起きています'}</p>
            </div>
            <img src="${catImage}" alt="Cat" class="cat-image" />
            <div class="status">
                <div class="status-item">
                    <div>好感度</div>
                    <div class="status-bar">
                        <div class="status-bar-fill affection-bar-fill" style="width: ${catState.affection}%;"></div>
                    </div>
                </div>
            </div>
            <div class="actions">
                <button id="feedButton" ${catState.isSleeping ? 'disabled' : ''}>餌をあげる</button>
                <button id="playButton" ${catState.isSleeping ? 'disabled' : ''}>遊ぶ</button>
                ${catState.isSleeping ? '<button id="wakeButton">起こす</button>' : ''}
            </div>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            document.getElementById('feedButton').addEventListener('click', () => {
                vscode.postMessage({
                    command: 'feed'
                });
            });
            document.getElementById('playButton').addEventListener('click', () => {
                vscode.postMessage({
                    command: 'play'
                });
            });
            ${
              catState.isSleeping
                ? `
            document.getElementById('wakeButton').addEventListener('click', () => {
                vscode.postMessage({
                    command: 'wake'
                });
            });
            `
                : ''
            }
        </script>
    </body>
    </html>`
}
