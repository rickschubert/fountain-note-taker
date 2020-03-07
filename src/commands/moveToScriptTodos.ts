import * as vscode from "vscode"
import {
    createCopyOfString,
    getActiveEditor,
    getTodoFileContent,
    getWorkspaceUri,
    writeTodoFile,
} from "../lib"
import {fileToAddTodoNotesTo, allUuidsRegex} from "../constants"

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
type uuid = string

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

const getCurrentChapterUuidFromFountainScript = (): uuid | undefined => {
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
    const headings = textBeforeSelected.match(allUuidsRegex)
    if (headings) {
        const lastHeading = headings[headings.length - 1]
        return lastHeading
            .trim()
            .replace(/\//g, "")
            .replace(/\*/g, "")
    }
}

const createMarkdownComment = (content: string): string => {
    return `<!-- ${content} -->`
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

const splitNoteBlockAtFollowingChapterUuid = (noteBlock: string): string[] => {
    // The noteblock that comes in does not have a heading - we can make use of that
    // to find the next heading
    const markdownChapterMarker = /(?=<!-- [a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12} -->)/
    // const followingChapterUuid = noteBlock.match(markdownChapterMarker)
    const textSplitAtFollowingHeading = noteBlock.split(markdownChapterMarker)
    // if (followingChapterUuid) {
    //     textSplitAtFollowingHeading[0] = `${followingChapterUuid}${textSplitAtFollowingHeading[0]}`
    // }
    return textSplitAtFollowingHeading
}

const appendNoteToExistingNoteBlock = (
    chapter: string,
    todoContent: string,
    noteToAdd: string
) => {
    const textSplitAtHeading = splitTodoTextAtMarkdownChapterMarking(
        chapter,
        todoContent
    )
    const textSplitAtFollowingHeading = splitNoteBlockAtFollowingChapterUuid(
        textSplitAtHeading[2]
    )
    let newText = `${textSplitAtHeading[0].trimRight()}\n\n${chapter}`
    if (textSplitAtFollowingHeading.length > 1) {
        // Move to the end of the text block
        newText = `${newText.trimRight() +
            textSplitAtFollowingHeading[0].trimRight()}\n${noteToAdd.trimRight()}\n\n${
            textSplitAtFollowingHeading[1]
        }`
    } else {
        // Append to the end of the file
        newText = `${newText +
            textSplitAtHeading[2].trimRight()}\n${noteToAdd.trimRight()}`
    }
    return newText
}

const moveCurrentlySelectedTextIntoSpecificChapter = (
    chapter: uuid,
    todoContent: string,
    textToAppend: string,
): string => {
    const markDownChapter = createMarkdownComment(chapter)
    const todoContentToMutate = createCopyOfString(todoContent)
    const chapterMarking = splitTodoTextAtMarkdownChapterMarking(
        markDownChapter,
        todoContentToMutate
    )
    if (chapterMarking.length < 2) {
        return appendNoteUnderNewHeading(
            markDownChapter,
            todoContent,
            textToAppend,
        )
    } else {
        return appendNoteToExistingNoteBlock(
            markDownChapter,
            todoContent,
            textToAppend,
        )
    }
}

export const placeTextIntoTodosFile = (
    chapter: uuid | undefined,
    todoContent: string,
    textToAppend: string,
) => {
    const newFileContent = chapter
        ? moveCurrentlySelectedTextIntoSpecificChapter(chapter, todoContent, textToAppend)
        : appendLineToText(todoContent, textToAppend)
    return newFileContent
}

const addTextToChapterInTodosFile = async (
    textToAppend: string
): Promise<string> => {
    const chapter = getCurrentChapterUuidFromFountainScript()
    const todoContent = await getTodoFileContent()
    const newFileContent = placeTextIntoTodosFile(chapter, todoContent, textToAppend)
    return newFileContent
}

const moveCurrentlySelectedTextIntoTodos = async () => {
    const workspaceUri = getWorkspaceUri()
    const directoryContents = await vscode.workspace.fs.readDirectory(workspaceUri)
    validateTodosFileExists(directoryContents)
    const newFileContent = await addTextToChapterInTodosFile(getCurrentlySelectedText())
    await writeTodoFile(newFileContent)

}

export const moveToScriptTodos = async () => {
    if (vscode.window.activeTextEditor) {
        await moveCurrentlySelectedTextIntoTodos()
        cutOutCurrentlySelectedText()
    }
}
