import * as vscode from "vscode"
import {
    convertStringToArrayBuffer,
    createCopyOfString,
    getActiveEditor,
} from "../lib"
import {fileToAddTodoNotesTo} from "../constants"

const getCurrentlySelectedTextRange = (): vscode.Range => {
    const activeEditor = getActiveEditor()
    const selectedTextInfo = activeEditor.selection
    const selTextRange = new vscode.Range(
        selectedTextInfo.start.line,
        selectedTextInfo.start.character,
        selectedTextInfo.end.line,
        selectedTextInfo.end.character
    )
    return selTextRange
}

const getCurrentlySelectedText = (): string => {
    const activeEditor = getActiveEditor()
    return activeEditor.document.getText(getCurrentlySelectedTextRange())
}

const removeCurrentlySelectedText = (editBuilder: vscode.TextEditorEdit) => {
    const currSel = getCurrentlySelectedTextRange()
    editBuilder.delete(currSel)
}

export const cutOutCurrentlySelectedText = () => {
    const activeEditor = getActiveEditor()
    activeEditor.edit(removeCurrentlySelectedText)
}

type VsCodeFile = [string, vscode.FileType]

const validateTodosFileExists = (directoryContents: VsCodeFile[]) => {
    const todoFile = directoryContents.find(
        (file) => file[0] === fileToAddTodoNotesTo
    )
    if (!todoFile) {
        throw new Error(
            `You need a file to which we can add the note. This should be with your setup a file called "${fileToAddTodoNotesTo}".`
        )
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
    await vscode.workspace.fs.writeFile(
        todoUri,
        convertStringToArrayBuffer(newContent)
    )
}

const getCurrentChapter = (): string | undefined => {
    const activeEditor = getActiveEditor()
    const selectedTextedRange = getCurrentlySelectedTextRange()
    const textRangeBeforeSelectedText = new vscode.Range(
        1,
        0,
        selectedTextedRange.end.line,
        selectedTextedRange.end.character
    )
    const textBeforeSelected = activeEditor.document.getText(
        textRangeBeforeSelectedText
    )
    const headings = textBeforeSelected.match(/ #(\d).*#$/gm)
    if (headings) {
        const lastHeading = headings[headings.length - 1]
        return lastHeading.trim()
    }
}

const convertFountainChapterToMarkDownChapter = (
    fountainChapter: string
): string => {
    return fountainChapter.replace(/#$/, "").replace(/#/, "# ")
}

const appendLineToText = (textBlock: string, line: string): string => {
    return `${textBlock.trimRight()}\n${line}\n`
}

const appendNoteUnderNewHeading = (
    chapter: string,
    todoContent: string,
    noteToAdd: string
): string => {
    return appendLineToText(todoContent, `\n${chapter}\n${noteToAdd}`)
}

const splitTodoTextAtMarkdownChapterMarking = (
    chapterMarking: string,
    fullText: string
): string[] => {
    return fullText.split(new RegExp(`(${chapterMarking})`, "gm"))
}

const splitNoteBlockAtHeadingAfterIt = (noteBlock: string): string[] => {
    // The noteblock that comes in does not have a heading - we can make use of that
    // to find the next heading
    const textSplitAtFollowingHeading = noteBlock.split(/(# \d)/)
    return textSplitAtFollowingHeading
}

const appendNoteToExistingNoteBlock = (
    chapter: string,
    todoContent: string,
    noteToAdd: string
) => {
    // TODO: This path still needs to be filled out
    const textSplitAtHeading = splitTodoTextAtMarkdownChapterMarking(
        chapter,
        todoContent
    )
    const textSplitAtFollowingHeading = splitNoteBlockAtHeadingAfterIt(
        textSplitAtHeading[2]
    )
    let newText = `${textSplitAtHeading[0].trimRight()}\n\n${chapter}`
    if (textSplitAtFollowingHeading.length > 1) {
        // Move to the end of the text block
        newText = `${newText.trimRight() +
            textSplitAtFollowingHeading[0].trimRight()}\n${noteToAdd.trimRight()}\n\n${
            textSplitAtFollowingHeading[1]
        }${textSplitAtFollowingHeading[2].trimRight()}`
    } else {
        // Append to the end of the file
        newText = `${newText +
            textSplitAtHeading[2].trimRight()}\n${noteToAdd.trimRight()}`
    }
    return newText
}

const moveCurrentlySelectedTextIntoSpecificChapter = (
    chapter: string,
    todoContent: string
): string => {
    const markDownChapter = convertFountainChapterToMarkDownChapter(chapter)
    let chapterMarking: any = createCopyOfString(todoContent)
    chapterMarking = splitTodoTextAtMarkdownChapterMarking(
        markDownChapter,
        chapterMarking
    )
    console.log(chapterMarking)
    if (chapterMarking.length < 2) {
        return appendNoteUnderNewHeading(
            markDownChapter,
            todoContent,
            getCurrentlySelectedText()
        )
    } else {
        return appendNoteToExistingNoteBlock(
            markDownChapter,
            todoContent,
            getCurrentlySelectedText()
        )
    }
}

const addTextToChapterInTodosFile = async (
    todoUri: vscode.Uri,
    textToAppend: string
) => {
    const chapter = getCurrentChapter()
    const todoContent = await getFileContent(todoUri)
    const newFileContent = chapter
        ? moveCurrentlySelectedTextIntoSpecificChapter(chapter, todoContent)
        : appendLineToText(todoContent, textToAppend)
    await writeTodoFile(todoUri, newFileContent)
}

const moveCurrentlySelectedTextIntoTodos = async () => {
    const workSpaceFolders = vscode.workspace.workspaceFolders
    if (!workSpaceFolders || workSpaceFolders.length > 1) {
        throw new Error(
            "It looks like you either don't have any folders opened or more than 1. This extension is not designed for such a setup. Please only open one folder in your workspace."
        )
    }
    const directoryContents = await vscode.workspace.fs.readDirectory(
        workSpaceFolders[0].uri
    )
    validateTodosFileExists(directoryContents)
    const todosFileUri = getTodosFileLocation(workSpaceFolders[0].uri)
    await addTextToChapterInTodosFile(todosFileUri, getCurrentlySelectedText())
}

export const moveToScriptTodos = async () => {
    if (vscode.window.activeTextEditor) {
        await moveCurrentlySelectedTextIntoTodos()
        cutOutCurrentlySelectedText()
    }
}
