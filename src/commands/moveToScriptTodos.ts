import * as vscode from 'vscode';
import { showTooltipMessage, convertStringToArrayBuffer } from '../lib';
import { fileToAddTodoNotesTo } from '../constants';

const getCurrentlySelectedTextRange = (): vscode.Range => {
    const activeEditor = vscode.window.activeTextEditor as vscode.TextEditor
    const selectedTextInfo = activeEditor.selection
    const selTextRange = new vscode.Range(selectedTextInfo.start.line, selectedTextInfo.start.character, selectedTextInfo.end.line, selectedTextInfo.end.character)
    return selTextRange
}

const getCurrentlySelectedText = (): string => {
    const activeEditor = vscode.window.activeTextEditor as vscode.TextEditor
    return activeEditor.document.getText(getCurrentlySelectedTextRange())
}

const removeCurrentlySelectedText = (editBuilder: vscode.TextEditorEdit) => {
    const currSel = getCurrentlySelectedTextRange()
    editBuilder.delete(currSel)
}

export const cutOutCurrentlySelectedText = () => {
    const activeEditor = vscode.window.activeTextEditor as vscode.TextEditor
    activeEditor.edit(removeCurrentlySelectedText)
}

type VsCodeFile = [string, vscode.FileType]

const validateTodosFileExists = (directoryContents: VsCodeFile[])  => {
    const todoFile = directoryContents.find((file) => file[0] === fileToAddTodoNotesTo)
    if (!todoFile) {
        throw new Error(`You need a file to which we can add the note. This should be with your setup a file called "${fileToAddTodoNotesTo}".`)
    }
}

const getTodosFileLocation = (workspaceUri: vscode.Uri): vscode.Uri => {
    return vscode.Uri.parse(`${workspaceUri}/${fileToAddTodoNotesTo}`)
}

const getFileContent = async (todoUri: vscode.Uri): Promise<string> => {
    const fileContentBuffer = await vscode.workspace.fs.readFile(todoUri)
    const fileContent = await fileContentBuffer.toString()
    return fileContent
}

const writeTodoFile = async (todoUri: vscode.Uri, newContent: string) => {
    await vscode.workspace.fs.writeFile(todoUri, convertStringToArrayBuffer(newContent))
}

const appendTextToTodoFile = async (todoUri: vscode.Uri, textToAppend: string) => {
    const fileContent = await getFileContent(todoUri)
    const newFileContent = fileContent.trimRight() + "\n" + textToAppend + "\n"
    await writeTodoFile(todoUri, newFileContent)
}

const getCurrentChapter = (): string | undefined => {
    const activeEditor = vscode.window.activeTextEditor as vscode.TextEditor
    const selectedTextedRange = getCurrentlySelectedTextRange()
    const textRangeBeforeSelectedText = new vscode.Range(1, 0, selectedTextedRange.end.line, selectedTextedRange.end.character)
    const textBeforeSelected = activeEditor.document.getText(textRangeBeforeSelectedText)
    const headings = textBeforeSelected.match(/ #(\d)(.+)?#$/gm)
    if (headings) {
        const lastHeading = headings[headings.length - 1]
        return lastHeading.trim()
    }
}

const addTextToChapterInTodosFile = async (todoUri: vscode.Uri, textToAppend: string) => {
    // const todoContent = await getFileContent(todoUri)
    const chapter = getCurrentChapter()
    console.log(chapter)
}

const moveCurrentlySelectedTextIntoTodos = async () => {
    const workSpaceFolders = vscode.workspace.workspaceFolders
    if (!workSpaceFolders || workSpaceFolders.length > 1) {
        return showTooltipMessage("It looks like you either don't have any folders opened or more than 1. This extension is not designed for such a setup. Please only open one folder in your workspace.")
    }
    const directoryContents = await vscode.workspace.fs.readDirectory(workSpaceFolders[0].uri)
    validateTodosFileExists(directoryContents)
    const todosFileUri = getTodosFileLocation(workSpaceFolders[0].uri)
    await appendTextToTodoFile(todosFileUri, getCurrentlySelectedText())
    await addTextToChapterInTodosFile(todosFileUri, getCurrentlySelectedText())
}

export const moveToScriptTodos = async () => {
    showTooltipMessage("Hello!")
    if (vscode.window.activeTextEditor) {
        await moveCurrentlySelectedTextIntoTodos()
        cutOutCurrentlySelectedText()
    }
}
