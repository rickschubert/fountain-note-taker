import * as vscode from "vscode"
import {moveToScriptTodos} from "./commands/moveToScriptTodos"
import {giveUniqueIdToHeading} from "./commands/giveUniqueIdToHeading"

const registerCommand = (
    commandTitle: string,
    commandFunction: Function
): vscode.Disposable => {
    return vscode.commands.registerCommand(commandTitle, () => {
        commandFunction()
    })
}

export const registerCommands = (context: vscode.ExtensionContext) => {
    const commands: vscode.Disposable[] = [
        registerCommand("moveToTodos", moveToScriptTodos),
        registerCommand("giveUniqueIdToHeading", giveUniqueIdToHeading),
    ]
    commands.forEach((command) => {
        context.subscriptions.push(command)
    })
}

export const showTooltipMessage = (message: string) => {
    vscode.window.showInformationMessage(message)
}

export const convertStringToArrayBuffer = (str: string) => {
    return new TextEncoder().encode(str)
}

export const createCopyOfString = (str: string) => {
    return ` ${str}`.slice(1)
}

export const getActiveEditor = (): vscode.TextEditor => {
    return vscode.window.activeTextEditor as vscode.TextEditor
}

export const getCurrentCursorPosition = (): vscode.Position => {
    const activeEditor = getActiveEditor()
    return new vscode.Position(
        activeEditor.selection.start.line,
        activeEditor.selection.start.character
    )
}
