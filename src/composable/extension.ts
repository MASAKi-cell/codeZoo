import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext): void {
  console.log(' "codezoo" is now active!');

  const disposable = vscode.commands.registerCommand(
    "codezoo.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from CodeZoo!");
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
