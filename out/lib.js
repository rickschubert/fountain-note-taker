"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const moveToScriptTodos_1 = require("./commands/moveToScriptTodos");
exports.registerCommands = (context) => {
    let disposable = vscode.commands.registerCommand('moveToTodos', () => {
        moveToScriptTodos_1.moveToScriptTodos();
    });
    context.subscriptions.push(disposable);
};
exports.showTooltipMessage = (message) => {
    vscode.window.showInformationMessage(message);
};
exports.convertStringToArrayBuffer = (str) => {
    return new TextEncoder().encode(str);
};
exports.createCopyOfString = (str) => {
    return (' ' + str).slice(1);
};
//# sourceMappingURL=lib.js.map