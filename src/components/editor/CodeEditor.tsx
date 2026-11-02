"use client";

import { useMemo, useState, useEffect } from "react";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
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
            return false;
          }
          return insertTab(view);
        },
        shift: (view) => {
          if (escapePressed) {
            escapePressed = false;
            return false;
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

const darkThemeExtension = EditorView.theme(
  {
    "&": {
      color: "#EDE8F5",
      backgroundColor: "#0E1328",
    },
    ".cm-content": {
      caretColor: "#7091E6",
      fontFamily: "var(--font-jetbrains-mono), monospace",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#7091E6",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "rgba(112, 145, 230, 0.35)",
    },
    ".cm-gutters": {
      backgroundColor: "#0B0F20",
      color: "#8697C4",
      borderRight: "1px solid rgba(255, 255, 255, 0.12)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(112, 145, 230, 0.08)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(112, 145, 230, 0.18)",
      color: "#EDE8F5",
    },
  },
  { dark: true }
);

const lightThemeExtension = EditorView.theme(
  {
    "&": {
      color: "#0D1326",
      backgroundColor: "#F3EFF8",
    },
    ".cm-content": {
      caretColor: "#3D52A0",
      fontFamily: "var(--font-jetbrains-mono), monospace",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#3D52A0",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "rgba(61, 82, 160, 0.22)",
    },
    ".cm-gutters": {
      backgroundColor: "#E6DFEE",
      color: "#3D52A0",
      borderRight: "1px solid rgba(61, 82, 160, 0.18)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(61, 82, 160, 0.06)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(61, 82, 160, 0.15)",
      color: "#0D1326",
    },
  },
  { dark: false }
);

export function CodeEditor({
  language,
  value,
  onChange,
  ariaLabel,
}: CodeEditorProps) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const extensions = useMemo(() => {
    const langExtension = language === "html" ? html() : css();
    const trapExtensions = createKeyboardTrapExtension();
    const themeExt = isLight ? lightThemeExtension : darkThemeExtension;

    return [
      langExtension,
      EditorView.lineWrapping,
      ...trapExtensions,
      themeExt,
    ];
  }, [language, isLight]);

  return (
    <div className="overflow-hidden rounded-b-xl border border-[var(--border-glass)] font-mono text-sm shadow-inner transition-colors duration-200">
      <CodeMirror
        value={value}
        height="320px"
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
