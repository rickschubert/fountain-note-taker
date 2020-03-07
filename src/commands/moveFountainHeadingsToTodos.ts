import {getActiveEditor, getTodoFileContent, writeTodoFile} from "../lib"
import {allUuidsRegex} from "../constants"
import * as vscode from "vscode"
/* eslint-disable complexity */
/* eslint-disable no-useless-escape */

export const moveFountainHeadingsToTodos = async () => {
    if (vscode.window.activeTextEditor) {
        const activeEditor = getActiveEditor()
        const script = activeEditor.document.getText()
        const uuidsInScript = script.match(allUuidsRegex)
        await findFountainHeadingsAndMoveThemToTodos(uuidsInScript, script)
    }
}

const getFountainSceneHeadingThatIsPlacedAfterUuid = (
    fullScript: string,
    uuid: string
): string | undefined => {
    const specificFountainHeadingRegex = new RegExp(`${uuid}\\*\/(.+)`, "s")
    const headingMatch = fullScript.match(specificFountainHeadingRegex)
    if (headingMatch && headingMatch.length > 1) {
        const heading = headingMatch[1]
            .replace(/\s+/i, "")
            .replace(/\n|\r.*/s, "")
        return heading
    }
}

const getUpdatedTodoDocumentWithHeadingsFromFountainScript = async (
    uuidsInScript: RegExpMatchArray,
    script: string
): Promise<string> => {
    const todoFileContent = await getTodoFileContent()
    const newTodoFile = uuidsInScript.reduce((todos, uuid) => {
        const fountainHeading = getFountainSceneHeadingThatIsPlacedAfterUuid(
            script,
            uuid
        )
        if (fountainHeading) {
            return replaceMarkdownHeadingAfterUuidWithNewHeading(
                todos,
                uuid,
                fountainHeading,
            )
        } else {
            return todos
        }
    }, todoFileContent)
    return newTodoFile
}

const findFountainHeadingsAndMoveThemToTodos = async (
    uuidsInScript: RegExpMatchArray | null,
    script: string
) => {
    if (uuidsInScript) {
        const newTodoFileContent = await getUpdatedTodoDocumentWithHeadingsFromFountainScript(uuidsInScript, script)
        await writeTodoFile(newTodoFileContent)
    }
}

export const replaceMarkdownHeadingAfterUuidWithNewHeading = (todoContent: string, uuid: string, newHeading: string) => {
    const todoSection = todoContent.match(
        new RegExp(`${uuid} -->(.+)`, "s")
    )
    if (todoSection !== null && todoSection.length < 1) {
        return todoContent
    }
    const uuidAndNewHeading = `${uuid} -->\n# ${newHeading}`
    // Add new heading straight after markdown UUID comment
    let newTodoContent = todoContent.replace(`${uuid} -->`, uuidAndNewHeading)
    // Remove previous heading, if one was present
    newTodoContent = newTodoContent.replace(new RegExp(`${uuidAndNewHeading}\n#.*?$`, "m"), (fullHeading) => {
        return fullHeading.replace(/\n#(?:.(?!#))+$/, "")
    })
    return newTodoContent
}
