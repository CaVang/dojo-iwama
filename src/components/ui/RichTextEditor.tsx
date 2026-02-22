"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo, ImageIcon, Link as LinkIcon, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, Table as TableIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const t = useTranslations("blogs.editor");

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt(t("image_url_prompt") || "URL hình ảnh:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor, t]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt(t("link_url_prompt") || "URL liên kết:", previousUrl);
    
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor, t]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200 border-x rounded-t-md sticky top-0 z-10">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded text-sm ${editor.isActive('bold') ? 'bg-gray-200 text-sumi font-bold' : 'text-sumi-muted hover:bg-gray-100'}`}
        title={t("bold")}
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded text-sm ${editor.isActive('italic') ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title={t("italic")}
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded text-sm ${editor.isActive('underline') ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title="Gạch chân"
      >
        <UnderlineIcon size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title={t("h1")}
      >
        <Heading1 size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title={t("h2")}
      >
        <Heading2 size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded text-sm ${editor.isActive('bulletList') ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title={t("bullet_list")}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded text-sm ${editor.isActive('orderedList') ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title={t("ordered_list")}
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded text-sm ${editor.isActive('blockquote') ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title={t("quote")}
      >
        <Quote size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-1.5 rounded text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title="Canh trái"
      >
        <AlignLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-1.5 rounded text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title="Canh giữa"
      >
        <AlignCenter size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-1.5 rounded text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title="Canh phải"
      >
        <AlignRight size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className={`p-1.5 rounded text-sm ${editor.isActive('table') ? 'bg-gray-200 text-sumi' : 'text-sumi-muted hover:bg-gray-100'}`}
        title="Chèn Bảng"
      >
        <TableIcon size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        type="button"
        onClick={setLink}
        className={`p-1.5 rounded text-sm ${editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'text-sumi-muted hover:bg-gray-100'}`}
        title={t("link")}
      >
        <LinkIcon size={16} />
      </button>
      <button
        type="button"
        onClick={addImage}
        className="p-1.5 rounded text-sm text-sumi-muted hover:bg-gray-100"
        title={t("image")}
      >
        <ImageIcon size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 rounded text-sm text-sumi-muted hover:bg-gray-100 disabled:opacity-30"
        title={t("undo")}
      >
        <Undo size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 rounded text-sm text-sumi-muted hover:bg-gray-100 disabled:opacity-30"
        title={t("redo")}
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
         heading: {
             levels: [2, 3, 4]
         }
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
          inline: true,
          HTMLAttributes: {
            class: 'max-w-full rounded-md shadow-sm my-4 h-auto object-cover',
          },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-japan-blue hover:underline cursor-pointer',
        },
      })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'overflow-auto max-h-[60vh] max-w-none prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6 prose-li:my-1 focus:outline-none min-h-[300px] p-4 bg-white',
      },
    },
  });

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
