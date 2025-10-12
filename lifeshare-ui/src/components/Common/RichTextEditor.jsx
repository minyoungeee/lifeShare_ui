import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const RichTextEditor = ({ name, content, onChange }) => {
    return (
        <div className="rich-text-editor">
            <CKEditor
                editor={ClassicEditor}
                data={content || ""}
                config={{
                    toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "blockQuote",
                        "|",
                        "undo",
                        "redo",
                    ],
                    htmlEncodeOutput: false,
                    entities: false,
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(name, data);
                }}
            />
        </div>
    );
};

export default RichTextEditor;
