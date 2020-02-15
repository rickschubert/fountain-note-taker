// eslint-disable-next-line no-unused-vars
import * as vscode from "vscode"
import { registerCommands } from "./lib"

export function activate(context: vscode.ExtensionContext) {
	registerCommands(context)
}

export function deactivate() {}
