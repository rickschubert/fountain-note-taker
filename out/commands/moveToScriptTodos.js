"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const lib_1 = require("../lib");
const constants_1 = require("../constants");
const getCurrentlySelectedTextRange = () => {
    const activeEditor = vscode.window.activeTextEditor;
    const selectedTextInfo = activeEditor.selection;
    const selTextRange = new vscode.Range(selectedTextInfo.start.line, selectedTextInfo.start.character, selectedTextInfo.end.line, selectedTextInfo.end.character);
    return selTextRange;
};
const getCurrentlySelectedText = () => {
    const activeEditor = vscode.window.activeTextEditor;
    return activeEditor.document.getText(getCurrentlySelectedTextRange());
};
const removeCurrentlySelectedText = (editBuilder) => {
    const currSel = getCurrentlySelectedTextRange();
    editBuilder.delete(currSel);
};
exports.cutOutCurrentlySelectedText = () => {
    const activeEditor = vscode.window.activeTextEditor;
    activeEditor.edit(removeCurrentlySelectedText);
};
const validateTodosFileExists = (directoryContents) => {
    const todoFile = directoryContents.find((file) => file[0] === constants_1.fileToAddTodoNotesTo);
    if (!todoFile) {
        throw new Error(`You need a file to which we can add the note. This should be with your setup a file called "${constants_1.fileToAddTodoNotesTo}".`);
    }
};
const getTodosFileLocation = (workspaceUri) => {
    return vscode.Uri.parse(`${workspaceUri}/${constants_1.fileToAddTodoNotesTo}`);
};
const getFileContent = (todoUri) => __awaiter(void 0, void 0, void 0, function* () {
    const fileContentBuffer = yield vscode.workspace.fs.readFile(todoUri);
    const fileContent = yield fileContentBuffer.toString();
    return fileContent;
});
const writeTodoFile = (todoUri, newContent) => __awaiter(void 0, void 0, void 0, function* () {
    yield vscode.workspace.fs.writeFile(todoUri, lib_1.convertStringToArrayBuffer(newContent));
});
const getCurrentChapter = () => {
    const activeEditor = vscode.window.activeTextEditor;
    const selectedTextedRange = getCurrentlySelectedTextRange();
    const textRangeBeforeSelectedText = new vscode.Range(1, 0, selectedTextedRange.end.line, selectedTextedRange.end.character);
    const textBeforeSelected = activeEditor.document.getText(textRangeBeforeSelectedText);
    const headings = textBeforeSelected.match(/ #(\d).*#$/gm);
    if (headings) {
        const lastHeading = headings[headings.length - 1];
        return lastHeading.trim();
    }
};
const convertFountainChapterToMarkDownChapter = (fountainChapter) => {
    return fountainChapter.replace(/#$/, "").replace(/#/, "# ");
};
const appendLineToText = (textBlock, line) => {
    return textBlock.trimRight() + "\n" + line + "\n";
};
const appendNoteUnderNewHeading = (chapter, todoContent, noteToAdd) => {
    return appendLineToText(todoContent, `\n${chapter}\n${noteToAdd}`);
};
const splitTodoTextAtMarkdownChapterMarking = (chapterMarking, fullText) => {
    return fullText.split(new RegExp(`(${chapterMarking})`, "gm"));
};
const splitNoteBlockAtHeadingAfterIt = (noteBlock) => {
    // The noteblock that comes in does not have a heading - we can make use of that
    // to find the next heading
    const textSplitAtFollowingHeading = noteBlock.split(/(# \d)/);
    return textSplitAtFollowingHeading;
};
const appendNoteToExistingNoteBlock = (chapter, todoContent, noteToAdd) => {
    // TODO: This path still needs to be filled out
    const textSplitAtHeading = splitTodoTextAtMarkdownChapterMarking(chapter, todoContent);
    const textSplitAtFollowingHeading = splitNoteBlockAtHeadingAfterIt(textSplitAtHeading[2]);
    let newText = textSplitAtHeading[0].trimRight() + "\n\n" + chapter;
    if (textSplitAtFollowingHeading.length > 1) {
        // Move to the end of the text block
        newText = newText.trimRight() + textSplitAtFollowingHeading[0].trimRight() + "\n" + noteToAdd.trimRight() + "\n\n" + textSplitAtFollowingHeading[1] + textSplitAtFollowingHeading[2].trimRight();
    }
    else {
        // Append to the end of the file
        newText = newText + textSplitAtHeading[2].trimRight() + "\n" + noteToAdd.trimRight();
    }
    return newText;
};
const moveCurrentlySelectedTextIntoSpecificChapter = (chapter, todoContent) => {
    const markDownChapter = convertFountainChapterToMarkDownChapter(chapter);
    let chapterMarking = lib_1.createCopyOfString(todoContent);
    chapterMarking = splitTodoTextAtMarkdownChapterMarking(markDownChapter, chapterMarking);
    console.log(chapterMarking);
    if (chapterMarking.length < 2) {
        return appendNoteUnderNewHeading(markDownChapter, todoContent, getCurrentlySelectedText());
    }
    else {
        return appendNoteToExistingNoteBlock(markDownChapter, todoContent, getCurrentlySelectedText());
    }
};
const addTextToChapterInTodosFile = (todoUri, textToAppend) => __awaiter(void 0, void 0, void 0, function* () {
    const chapter = getCurrentChapter();
    const todoContent = yield getFileContent(todoUri);
    const newFileContent = chapter
        ? moveCurrentlySelectedTextIntoSpecificChapter(chapter, todoContent)
        : appendLineToText(todoContent, textToAppend);
    yield writeTodoFile(todoUri, newFileContent);
});
const moveCurrentlySelectedTextIntoTodos = () => __awaiter(void 0, void 0, void 0, function* () {
    const workSpaceFolders = vscode.workspace.workspaceFolders;
    if (!workSpaceFolders || workSpaceFolders.length > 1) {
        return lib_1.showTooltipMessage("It looks like you either don't have any folders opened or more than 1. This extension is not designed for such a setup. Please only open one folder in your workspace.");
    }
    const directoryContents = yield vscode.workspace.fs.readDirectory(workSpaceFolders[0].uri);
    validateTodosFileExists(directoryContents);
    const todosFileUri = getTodosFileLocation(workSpaceFolders[0].uri);
    yield addTextToChapterInTodosFile(todosFileUri, getCurrentlySelectedText());
});
exports.moveToScriptTodos = () => __awaiter(void 0, void 0, void 0, function* () {
    lib_1.showTooltipMessage("Hello!");
    if (vscode.window.activeTextEditor) {
        yield moveCurrentlySelectedTextIntoTodos();
        exports.cutOutCurrentlySelectedText();
    }
});
//# sourceMappingURL=moveToScriptTodos.js.map