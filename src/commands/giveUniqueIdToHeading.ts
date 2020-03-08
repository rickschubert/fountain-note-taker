import {getActiveEditor, getCurrentCursorPosition} from "../lib"
import * as vscode from "vscode"
import * as uuid from "uuid"

export const giveUniqueIdToHeading = () => {
    if (vscode.window.activeTextEditor) {
        const activeEditor = getActiveEditor()
        activeEditor.edit((editBuilder) => {
            const uuidComment = `/*${uuid.v4()}*/\n`
            editBuilder.insert(getCurrentCursorPosition(), uuidComment)
        })
    }
}
