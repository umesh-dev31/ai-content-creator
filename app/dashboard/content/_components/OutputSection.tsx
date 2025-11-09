import React, { useRef } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

function OutputSection() {
  const editorRef = useRef<any>(null);
  return (
    <div className='bg-white shadow-lg border rounded-lg'>
      <div className='flex justify-between items-center p-5'>
        <h2 className='text-xl font-bold'>Your Content</h2>
        <Button><Copy/>Copy</Button>
      </div>
      <Editor
      ref={editorRef} 
    initialValue="Your Content will be generated here..."
    height="600px"
    initialEditType="wysiwyg"
    useCommandShortcut={true}
    onChange={()=>console.log(editorRef.current.getInstance().getMarkdown())}
  />
    </div>
  )
}

export default OutputSection
