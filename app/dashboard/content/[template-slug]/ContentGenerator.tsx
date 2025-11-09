"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import { Button } from '@/components/ui/button'

interface ContentGeneratorProps {
  selectedTemplate: TEMPLATE;
}

function ContentGenerator({ selectedTemplate }: ContentGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');

  const GenerateAIContent = async (formData: any) => {
    try {
      setLoading(true);
      console.log('Generating content with formData:', formData);
      console.log('AI Prompt:', selectedTemplate?.aiPrompt);

      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formData,
          aiPrompt: selectedTemplate?.aiPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const result = await response.json();
      console.log('AI Response received:', result);
      console.log('Generated content:', result.content);

      if (result.success && result.content) {
        setGeneratedContent(result.content);
      } else {
        console.error('Unexpected response format:', result);
      }
    } catch (error: any) {
      console.error('Error in GenerateAIContent:', error);
      alert('Failed to generate content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5'>
      {/* Back Button */}
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-5 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {/* FORMSECTION */}
        <FormSection 
          selectedTemplate={selectedTemplate}
          userFormInput={GenerateAIContent}
          loading={loading}
        />

        {/* OUTPUTSECTION */}
        <div className='col-span-2'>
          <OutputSection content={generatedContent} />
        </div>
      </div>
    </div>
  );
}

export default ContentGenerator

