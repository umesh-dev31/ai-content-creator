"use client"
import React from 'react'
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
  const GenerateAIContent = (formData: any) => {
    console.log('Form data received:', formData);
    // Handle AI content generation here
    // You can add API calls, state updates, etc.
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
        />

        {/* OUTPUTSECTION */}
        <div className='col-span-2'>
          <OutputSection/>
        </div>
      </div>
    </div>
  );
}

export default ContentGenerator

