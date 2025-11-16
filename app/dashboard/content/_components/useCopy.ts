import { useState } from 'react';
import { copyToClipboard, copyEditorContent, copyHtmlContent } from './copyUtils';

/**
 * React hook for copy functionality with state management
 * @returns Object with copy function, copied state, and reset function
 */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCopied(false);
    setError(null);
  };

  const copy = async (text: string) => {
    setError(null);
    const success = await copyToClipboard(
      text,
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        setError(err.message);
      }
    );
    return success;
  };

  const copyFromEditor = async (editorRef: React.RefObject<any>) => {
    setError(null);
    const success = await copyEditorContent(
      editorRef,
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        setError(err.message);
      }
    );
    return success;
  };

  const copyHtml = async (html: string) => {
    setError(null);
    const success = await copyHtmlContent(
      html,
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        setError(err.message);
      }
    );
    return success;
  };

  return {
    copy,
    copyFromEditor,
    copyHtml,
    copied,
    error,
    reset,
  };
}

