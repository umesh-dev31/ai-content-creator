"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'

interface ContentGeneratorProps {
  selectedTemplate: TEMPLATE;
}

function ContentGenerator({ selectedTemplate }: ContentGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const { user } = useUser();

  const SaveInDB = async (formData: any, slug: string, aiResponse: string) => {
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || user?.id || '';
      
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formData,
          templateSlug: slug,
          aiResponse: aiResponse,
          userEmail: userEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving to DB:', errorData);
        return;
      }

      const result = await response.json();
      console.log('Content saved successfully:', result);
    } catch (error: any) {
      console.error('Error saving to database:', error);
    }
  };

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
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('API Error:', errorData);
        const errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}` 
          : (errorData.error || 'Failed to generate content');
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('AI Response received:', result);
      console.log('Generated content:', result.content);

      if (result.success && result.content) {
        setGeneratedContent(result.content);
        // Save to database after successful generation
        await SaveInDB(formData, selectedTemplate.slug, result.content);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('usageUpdated'));
        }
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

