"use client";

import { useEffect, useState, type MouseEvent } from "react";

import type { Editor } from "@tiptap/react";

interface CursorTooltip {
  text: string;
  x: number;
  y: number;
}

interface ToolbarProps {
  editor: Editor;
  onImageUpload: () => void;
  onLinkAdd: () => void;
}

interface ToolbarButton {
  label: string;
  action: () => void;
  isActive?: boolean;
  title: string;
}

export function EditorToolbar({ editor, onImageUpload, onLinkAdd }: ToolbarProps) {
  const [, setTick] = useState(0);
  const [tooltip, setTooltip] = useState<CursorTooltip | null>(null);

  const showTooltip = (text: string, e: MouseEvent<HTMLButtonElement>) => {
    setTooltip({ text, x: e.clientX, y: e.clientY });
  };

  const moveTooltip = (text: string, e: MouseEvent<HTMLButtonElement>) => {
    setTooltip({ text, x: e.clientX, y: e.clientY });
  };

  const hideTooltip = () => setTooltip(null);

  useEffect(() => {
    if (!editor) return;
    const update = () => setTick((t) => t + 1);
    editor.on("transaction", update);
    editor.on("selectionUpdate", update);
    return () => {
      editor.off("transaction", update);
      editor.off("selectionUpdate", update);
    };
  }, [editor]);

  const groups: ToolbarButton[][] = [
    // Headings
    [
      {
        label: "H1",
        title: "Heading 1",
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: editor.isActive("heading", { level: 1 }),
      },
      {
        label: "H2",
        title: "Heading 2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: editor.isActive("heading", { level: 2 }),
      },
      {
        label: "H3",
        title: "Heading 3",
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: editor.isActive("heading", { level: 3 }),
      },
    ],
    // Inline formatting
    [
      {
        label: "B",
        title: "Bold",
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: editor.isActive("bold"),
      },
      {
        label: "I",
        title: "Italic",
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: editor.isActive("italic"),
      },
      {
        label: "S̶",
        title: "Strikethrough",
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: editor.isActive("strike"),
      },
      {
        label: "` `",
        title: "Inline Code",
        action: () => editor.chain().focus().toggleCode().run(),
        isActive: editor.isActive("code"),
      },
    ],
    // Blocks
    [
      {
        label: "❝",
        title: "Blockquote",
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: editor.isActive("blockquote"),
      },
      {
        label: "•—",
        title: "Bullet List",
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: editor.isActive("bulletList"),
      },
      {
        label: "1—",
        title: "Ordered List",
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: editor.isActive("orderedList"),
      },
      {
        label: "◻",
        title: "Code Block",
        action: () => editor.chain().focus().toggleCodeBlock().run(),
        isActive: editor.isActive("codeBlock"),
      },
    ],
    // Table
    [
      {
        label: "⊞",
        title: "Insert Table",
        action: () =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run(),
      },
      ...(editor.isActive("table")
        ? [
            {
              label: "+Row",
              title: "Add Row After",
              action: () => editor.chain().focus().addRowAfter().run(),
            },
            {
              label: "-Row",
              title: "Delete Row",
              action: () => editor.chain().focus().deleteRow().run(),
            },
            {
              label: "+Col",
              title: "Add Column After",
              action: () => editor.chain().focus().addColumnAfter().run(),
            },
            {
              label: "-Col",
              title: "Delete Column",
              action: () => editor.chain().focus().deleteColumn().run(),
            },
            {
              label: "🗑 Table",
              title: "Delete Table",
              action: () => editor.chain().focus().deleteTable().run(),
            },
          ]
        : []),
    ],
    // Media/links
    [
      {
        label: "🔗",
        title: "Add Link",
        action: onLinkAdd,
        isActive: editor.isActive("link"),
      },
      {
        label: "🖼",
        title: "Upload Image",
        action: onImageUpload,
      },
    ],
    // History
    [
      {
        label: "↩",
        title: "Undo",
        action: () => editor.chain().focus().undo().run(),
      },
      {
        label: "↪",
        title: "Redo",
        action: () => editor.chain().focus().redo().run(),
      },
    ],
  ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 px-4 py-3">
        {groups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {group.map((btn, bi) => (
              <button
                key={bi}
                type="button"
                onClick={btn.action}
                onMouseEnter={(e) => showTooltip(btn.title, e)}
                onMouseMove={(e) => moveTooltip(btn.title, e)}
                onMouseLeave={hideTooltip}
                onMouseDown={(e) => e.preventDefault()}
                className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  btn.isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {btn.label}
              </button>
            ))}
            {gi < groups.length - 1 && (
              <div className="w-px h-5 bg-gray-300 mx-1" />
            )}
          </div>
        ))}
      </div>

      {tooltip && (
        <div
          role="tooltip"
          className="fixed z-[100] pointer-events-none -translate-x-1/2 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y + 14 }}
        >
          {tooltip.text}
        </div>
      )}
    </>
  );
}
