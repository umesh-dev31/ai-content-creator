import React, { useRef, useEffect } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useCopy } from './useCopy';

interface OutputSectionProps {
  content?: string;
}

function OutputSection({ content }: OutputSectionProps) {
  const editorRef = useRef<any>(null);
  const { copyFromEditor, copied } = useCopy();

  useEffect(() => {
    if (content && editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(content);
    }
  }, [content]);

  const handleCopy = async () => {
    await copyFromEditor(editorRef);
  };

  return (
    <div className='bg-white/5 shadow-lg border border-white/10 rounded-lg'>
      <div className='flex justify-between items-center p-5 border-b border-white/10'>
        <h2 className='text-xl font-bold text-white'>Your Content</h2>
        <Button onClick={handleCopy} className='bg-red-600 hover:bg-red-700 text-white'>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className='bg-white'>
        <Editor
          ref={editorRef} 
          initialValue={content || "Your Content will be generated here..."}
          height="600px"
          initialEditType="wysiwyg"
          useCommandShortcut={true}
        />
      </div>
    </div>
  )
}

export default OutputSection
