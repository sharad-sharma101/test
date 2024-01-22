// @ts-nocheck
import React, { useState } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { stateFromHTML } from "draft-js-import-html";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./index.css";
import { useEffect } from "react";

const ContentEditor = ({
  htmlContent,
  setContent,
  toolbarHidden = true,
  nanoid,
  formatType = "plain",
  onFocus = () => {},
  onBlur=()=>{}
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const onBlurHandler = () => {
    setIsEditMode(false);
    onBlur()
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    let text = "";
    blocks.map((block, index) => {
      text +=
        !block.text.trim().length && blocks.length !== index + 1
          ? "\n"
          : blocks.length !== index + 1
          ? block.text + "\n"
          : block.text;
      return !block.text.trim().length ? "\n" : block.text;
    });
    if (htmlContent == text) return;
    setContent(text);
  };
  const initEditorState = () => {
    if (!htmlContent) return;
    if (formatType === "plain") {
      setEditorState(
        EditorState.createWithContent(ContentState.createFromText(htmlContent))
      );
    } else {
      setEditorState(EditorState.createWithContent(stateFromHTML(htmlContent)));
    }
  };

  useEffect(() => {
    initEditorState();
  }, []);
  useEffect(() => {
    initEditorState();
  }, [htmlContent]);
  return (
    <Editor
      key={nanoid}
      onFocus={() => {
        onFocus();
        setIsEditMode(true);
      }}
      toolbarHidden={toolbarHidden}
      editorState={editorState}
      onEditorStateChange={handleEditorChange}
      onBlur={onBlurHandler}
      wrapperClassName={`wrapper-editor-class`}
      editorClassName={`editor-class ${isEditMode && "focus"}`}
      toolbarClassName="toolbar-class"
    />
  );
};
export default ContentEditor;
