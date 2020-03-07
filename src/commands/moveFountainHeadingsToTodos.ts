import {getActiveEditor, getTodoFileContent, writeTodoFile, showTooltipMessage} from "../lib"
import {allUuidsRegex} from "../constants"
import * as vscode from "vscode"
/* eslint-disable complexity */
/* eslint-disable no-useless-escape */

export const moveFountainHeadingsToTodos = async () => {
    if (vscode.window.activeTextEditor) {
        showTooltipMessage("Updating headings - don't amend document until finished.")
        const activeEditor = getActiveEditor()
        const script = activeEditor.document.getText()
        const uuidsInScript = script.match(allUuidsRegex)
        await findFountainHeadingsAndMoveThemToTodos(uuidsInScript, script)
        showTooltipMessage("Finished updating headings.")
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

const findFountainHeadingsAndMoveThemToTodos = async (
    uuidsInScript: RegExpMatchArray | null,
    script: string
) => {
    if (uuidsInScript) {
        for (let index = 0; index < uuidsInScript.length; index++) {
            const uuid = uuidsInScript[index]
            // eslint-disable-next-line no-await-in-loop
            await findFountainHeadingAndMoveToTodo(script, uuid)
        }
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

const findFountainHeadingAndMoveToTodo = async (script: string, uuid: string) => {
    const fountainHeading = getFountainSceneHeadingThatIsPlacedAfterUuid(
        script,
        uuid
    )
    if (fountainHeading) {
        const todoFileContent = await getTodoFileContent()
        const newTodoFileContent = replaceMarkdownHeadingAfterUuidWithNewHeading(
            todoFileContent,
            uuid,
            fountainHeading
        )
        await writeTodoFile(newTodoFileContent)
    }
}
