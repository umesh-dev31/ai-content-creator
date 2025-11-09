import React, { useRef, useEffect } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface OutputSectionProps {
  content?: string;
}

function OutputSection({ content }: OutputSectionProps) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (content && editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(content);
    }
  }, [content]);

  const handleCopy = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      const markdown = editorInstance.getMarkdown();
      navigator.clipboard.writeText(markdown);
      console.log('Content copied to clipboard');
    }
  };

  return (
    <div className='bg-white shadow-lg border rounded-lg'>
      <div className='flex justify-between items-center p-5'>
        <h2 className='text-xl font-bold'>Your Content</h2>
        <Button onClick={handleCopy}><Copy/>Copy</Button>
      </div>
      <Editor
        ref={editorRef} 
        initialValue={content || "Your Content will be generated here..."}
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
      />
    </div>
  )
}

export default OutputSection
