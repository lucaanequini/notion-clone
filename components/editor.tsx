'use client'

import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { useCreateBlockNote, useEditorChange } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import "@blocknote/mantine/style.css";
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Block } from '@blocknote/core';
import { useEdgeStore } from '@/lib/edgestore';


interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const { resolvedTheme } = useTheme()
    const { edgestore } = useEdgeStore()

    const handleUpload = async (file: File) => {
        const response = await edgestore.publicFiles.upload({
            file
        })
        return response.url
    }

    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile: handleUpload
    });

    const onSave = () => {
        if (blocks === editor.document) {
            console.log(blocks)
            console.log(editor.document)
            return
        } else {
            setBlocks(editor.document)
            onChange(JSON.stringify(blocks, null, 2))
        }
    }

    return (
        <div>
            <BlockNoteView onChange={onSave} editor={editor} theme={resolvedTheme === 'dark' ? 'dark' : 'light'} editable={editable} />
        </div>
    );
};

export default Editor