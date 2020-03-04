import { getActiveEditor } from "../lib"
import { allUuidsRegex } from "../constants"
import * as vscode from "vscode"

const moveFountainHeadingIntoCorrespondingTodoNote = (uuid: string) => {

}

export const moveFountainHeadingsToTodos = () => {
    if (vscode.window.activeTextEditor) {
        const activeEditor = getActiveEditor()
        const script = activeEditor.document.getText()
        const uuidsInScript = script.match(allUuidsRegex)
        uuidsInScript?.forEach(moveFountainHeadingIntoCorrespondingTodoNote)
    }
}
