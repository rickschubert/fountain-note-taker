"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const moveToScriptTodos_1 = require("../commands/moveToScriptTodos");
exports.registerCommands = (context) => {
    let disposable = vscode.commands.registerCommand('moveToTodos', () => {
        moveToScriptTodos_1.moveToScriptTodos();
    });
    context.subscriptions.push(disposable);
};
exports.showTooltipMessage = (message) => {
    vscode.window.showInformationMessage(message);
};
//# sourceMappingURL=lib.js.map