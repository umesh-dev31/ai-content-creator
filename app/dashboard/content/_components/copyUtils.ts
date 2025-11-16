/**
 * Copy text to clipboard utility function
 * @param text - The text to copy to clipboard
 * @param onSuccess - Optional callback when copy succeeds
 * @param onError - Optional callback when copy fails
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function copyToClipboard(
  text: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<boolean> {
  try {
    // Check if clipboard API is available
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not available');
    }

    // Remove HTML tags if present
    const plainText = text.replace(/<[^>]*>/g, '').trim();

    if (!plainText) {
      throw new Error('No text to copy');
    }

    await navigator.clipboard.writeText(plainText);
    
    if (onSuccess) {
      onSuccess();
    }
    
    return true;
  } catch (error: any) {
    console.error('Failed to copy text:', error);
    
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text.replace(/<[^>]*>/g, '').trim();
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (fallbackError: any) {
      if (onError) {
        onError(fallbackError);
      }
      return false;
    }
  }
}

/**
 * Copy markdown content from Toast UI Editor
 * @param editorRef - Reference to the Toast UI Editor instance
 * @param onSuccess - Optional callback when copy succeeds
 * @param onError - Optional callback when copy fails
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function copyEditorContent(
  editorRef: React.RefObject<any>,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<boolean> {
  try {
    if (!editorRef.current) {
      throw new Error('Editor reference not available');
    }

    const editorInstance = editorRef.current.getInstance();
    const markdown = editorInstance.getMarkdown();
    
    return await copyToClipboard(markdown, onSuccess, onError);
  } catch (error: any) {
    console.error('Failed to copy editor content:', error);
    if (onError) {
      onError(error);
    }
    return false;
  }
}

/**
 * Copy HTML content (converts to plain text)
 * @param html - HTML string to copy
 * @param onSuccess - Optional callback when copy succeeds
 * @param onError - Optional callback when copy fails
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function copyHtmlContent(
  html: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<boolean> {
  return await copyToClipboard(html, onSuccess, onError);
}

