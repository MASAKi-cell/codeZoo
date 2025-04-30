import * as vscode from 'vscode'
import { Cat } from '../cat'
import { MESSAGE } from '../config/constants'
import { CatState } from '../store/catState'

export function activate(context: vscode.ExtensionContext): void {
  console.log(MESSAGE.ACTIVATE)

  // 初期化
  const stateManager = new CatState(context.globalState)
  const cat = new Cat(stateManager)
  let panel: vscode.WebviewPanel | null = null // Webviewパネルの作成

  // コマンドの登録
  let disposable = vscode.commands.registerCommand('codezoo.show', () => {
    if (panel) {
      panel.reveal()
    } else {
      panel = createWebviewPanel(context, cat)

      // パネルが閉じられたときの処理
      if (panel) {
        panel.onDidDispose(
          () => {
            panel = null
          },
          null,
          context.subscriptions
        )
      }
    }
  })

  // ステータスバーアイテムの作成
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBarItem.text = '$(heart) CodeZoo'
  statusBarItem.command = 'codezoo.show'
  statusBarItem.tooltip = '猫を見る'
  statusBarItem.show()

  // タイマーの設定（1分ごとに実行）
  setInterval(() => {
    const now = new Date()
    const hour = now.getHours()

    // 夜間判定（22時〜6時）
    const isNight = hour >= 22 || hour < 6
    cat.updateTimeState(isNight)

    if (panel) {
      updateWebview(panel, cat)
    }
  }, 60000)

  // コミットイベントのリスナー
  const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports
  if (gitExtension) {
    const git = gitExtension.getAPI(1)
    if (git) {
      git.onDidChangeState(() => {
        // コミット検出のロジック
        checkForCommits(git, cat)
      })
    }
  }

  // 作業時間監視
  let lastActivity = new Date()
  vscode.workspace.onDidChangeTextDocument(() => {
    const now = new Date()
    // 一定時間（例：30分）作業を続けるとご褒美
    if (now.getTime() - lastActivity.getTime() > 30 * 60 * 1000) {
      cat.increaseAffection(5)
      vscode.window.showInformationMessage('30分作業を続けました！猫の好感度が上がりました！')
      if (panel) {
        updateWebview(panel, cat)
      }
    }
    lastActivity = now
  })

  const updateWebview = (panel: vscode.WebviewPanel, cat: Cat) => {
    panel.webview.postMessage({
      command: 'update',
      catState: cat.getState()
    })
  }

  const checkForCommits = async (git: any, cat: Cat) => {
    const repositories = git.repositories
    if (repositories.length > 0) {
      const repo = repositories[0]
      cat.feedCat(10)
      vscode.window.showInformationMessage('コミットを検出しました！猫にご褒美をあげました！')
    }
  }

  context.subscriptions.push(disposable, statusBarItem)
}

export function deactivate(): void {}
