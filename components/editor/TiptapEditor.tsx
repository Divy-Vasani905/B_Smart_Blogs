"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { Link as TiptapLink } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useCallback, useRef } from "react";
import { EditorToolbar } from "./Toolbar";
import { api, isOk } from "@/lib/api";

interface TiptapEditorProps {
  content?: Record<string, unknown>;
  onChange: (json: Record<string, unknown>, html: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing your blog...",
  maxLength = 50000,
}: TiptapEditorProps) {
  const uploadingRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      TiptapImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-xl max-w-full mx-auto block",
          loading: "lazy",
        },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: maxLength }),
    ],
    content: content ?? null,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[500px] focus:outline-none p-6 text-gray-900",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getJSON() as Record<string, unknown>, editor.getHTML());
    },
  });

  const handleImageUpload = useCallback(async () => {
    if (!editor || uploadingRef.current) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      uploadingRef.current = true;
      try {
        const formData = new FormData();
        formData.append("image", file);

        const { data, status } = await api.post("/api/upload/image", formData);

        if (!isOk(status)) {
          alert(data.error || "Upload failed");
          return;
        }

        editor.chain().focus().setImage({ src: data.data.url, alt: file.name }).run();
      } catch {
        alert("Image upload failed. Please try again.");
      } finally {
        uploadingRef.current = false;
      }
    };
    input.click();
  }, [editor]);

  const handleLinkAdd = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const charCount = editor.storage.characterCount?.characters?.() ?? 0;
  const pct = Math.round((charCount / maxLength) * 100);

  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm flex flex-col relative">
      {/* Toolbar */}
      <div className="sticky top-14 sm:top-16 z-40 bg-gray-50 rounded-t-2xl border-b border-gray-200">
        <EditorToolbar
          editor={editor}
          onImageUpload={handleImageUpload}
          onLinkAdd={handleLinkAdd}
        />
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Footer: word / char count */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <span className="text-xs text-gray-400">
          {editor.storage.characterCount?.words?.()} words
        </span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <span className={`text-xs ${pct > 90 ? "text-red-500" : "text-gray-400"}`}>
            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
