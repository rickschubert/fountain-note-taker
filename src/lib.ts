import * as vscode from "vscode"
import {moveToScriptTodos} from "./commands/moveToScriptTodos"
import {giveUniqueIdToHeading} from "./commands/giveUniqueIdToHeading"
import {moveFountainHeadingsToTodos} from "./commands/moveFountainHeadingsToTodos"
import { fileToAddTodoNotesTo } from "./constants"

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
        registerCommand("moveFountainHeadingsToTodos", moveFountainHeadingsToTodos),
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

const getFileContent = async (todoUri: vscode.Uri): Promise<string> => {
    const fileContentBuffer = await vscode.workspace.fs.readFile(todoUri)
    const fileContent = await fileContentBuffer.toString()
    return fileContent
}

const getTodosFileLocation = (workspaceUri: vscode.Uri): vscode.Uri => {
    return vscode.Uri.parse(`${workspaceUri}/${fileToAddTodoNotesTo}`)
}

export const getTodoFileContent = async (): Promise<string> => {
    const todoUri = getTodosFileLocation(workSpaceFolders[0].uri)
    return await getFileContent(todoUri)
}
