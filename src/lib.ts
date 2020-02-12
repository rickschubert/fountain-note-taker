import * as vscode from 'vscode';
import {moveToScriptTodos} from "./commands/moveToScriptTodos"

export const registerCommands = (context: vscode.ExtensionContext) => {
	let disposable = vscode.commands.registerCommand('moveToTodos', () => {
		moveToScriptTodos();
	});
	context.subscriptions.push(disposable);
}

export const showTooltipMessage = (message: string) => {
    vscode.window.showInformationMessage(message);
}

export const convertStringToArrayBuffer = (str: string) => {
	return new TextEncoder().encode(str);
}
