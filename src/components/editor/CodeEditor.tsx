"use client";

import { useMemo } from "react";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { insertTab, indentLess } from "@codemirror/commands";

interface CodeEditorProps {
  language: "html" | "css";
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}

function createKeyboardTrapExtension() {
  let escapePressed = false;

  return [
    keymap.of([
      {
        key: "Escape",
        run: () => {
          escapePressed = true;
          return true;
        },
      },
      {
        key: "Tab",
        run: (view) => {
          if (escapePressed) {
            escapePressed = false;
            return false; // Release trap: let browser move focus
          }
          return insertTab(view);
        },
        shift: (view) => {
          if (escapePressed) {
            escapePressed = false;
            return false; // Release trap: let browser move focus backward
          }
          return indentLess(view);
        },
      },
    ]),
    EditorView.domEventHandlers({
      keydown: (event) => {
        if (event.key !== "Escape" && event.key !== "Tab") {
          escapePressed = false;
        }
      },
      blur: () => {
        escapePressed = false;
      },
    }),
  ];
}

export function CodeEditor({
  language,
  value,
  onChange,
  ariaLabel,
}: CodeEditorProps) {
  const extensions = useMemo(() => {
    const langExtension = language === "html" ? html() : css();
    const trapExtensions = createKeyboardTrapExtension();

    return [langExtension, EditorView.lineWrapping, ...trapExtensions];
  }, [language]);

  return (
    <div className="overflow-hidden rounded-b-lg border border-slate-700 bg-[#282c34] font-mono text-sm">
      <CodeMirror
        value={value}
        height="320px"
        theme={oneDark}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: true,
          autocompletion: true,
        }}
        extensions={extensions}
        onChange={onChange}
        aria-label={ariaLabel}
      />
    </div>
  );
}
