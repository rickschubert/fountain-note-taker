import * as vscode from "vscode"
import {moveToScriptTodos} from "./commands/moveToScriptTodos"
import {giveUniqueIdToHeading} from "./commands/giveUniqueIdToHeading"
import {moveFountainHeadingsToTodos} from "./commands/moveFountainHeadingsToTodos"
import {fileToAddTodoNotesTo} from "./constants"
import * as eol from "eol"

const registerCommand = (
    commandTitle: string,
    commandFunction: Function
): vscode.Disposable => {
    return vscode.commands.registerCommand(commandTitle, () => {
        commandFunction()
    })
}

export const registerCommands = (context: vscode.ExtensionContext): void => {
    const commands: vscode.Disposable[] = [
        registerCommand("moveToTodos", moveToScriptTodos),
        registerCommand("giveUniqueIdToHeading", giveUniqueIdToHeading),
        registerCommand(
            "moveFountainHeadingsToTodos",
            moveFountainHeadingsToTodos
        ),
    ]
    commands.forEach((command) => {
        context.subscriptions.push(command)
    })
}

export const showTooltipMessage = (message: string): void => {
    vscode.window.showInformationMessage(message)
}

export const convertStringToArrayBuffer = (str: string): Uint8Array => {
    return new TextEncoder().encode(str)
}

export const createCopyOfString = (str: string): string => {
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

export const getTodosFileLocation = (): vscode.Uri => {
    const workspaceUri = getWorkspaceUri()
    return vscode.Uri.parse(`${workspaceUri}/${fileToAddTodoNotesTo}`)
}

export const getTodoFileContent = async (): Promise<string> => {
    const todoUri = getTodosFileLocation()
    const fileContent = await getFileContent(todoUri)
    const contentWithNormalisedLineReturns = eol.lf(fileContent)
    return contentWithNormalisedLineReturns
}

export const getWorkspaceUri = (): vscode.Uri => {
    const workSpaceFolders = vscode.workspace.workspaceFolders
    if (!workSpaceFolders || workSpaceFolders.length > 1) {
        throw new Error(
            "It looks like you either don't have any folders opened or more than 1. This extension is not designed for such a setup. Please only open one folder in your workspace."
        )
    }
    return workSpaceFolders[0].uri
}

export const writeTodoFile = async (newContent: string): Promise<void> => {
    const todoUri = getTodosFileLocation()
    const newContentNormalisedForOS = eol.auto(newContent)
    await vscode.workspace.fs.writeFile(
        todoUri,
        convertStringToArrayBuffer(newContentNormalisedForOS)
    )
}
