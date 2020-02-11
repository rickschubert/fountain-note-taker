import * as vscode from 'vscode';
import { showTooltipMessage } from '../lib';

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

export const moveToScriptTodos = () => {
    showTooltipMessage("Hello!")
    if (vscode.window.activeTextEditor) {
        cutOutCurrentlySelectedText()
    }
}
