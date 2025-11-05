import React from 'react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Templates from '@/app/(data)/Templates'

async function CreateNewContent({ params }: { params: Promise<{ 'template-slug': string }> }) {
  const awaitedParams = await params;
  const slug = decodeURIComponent((awaitedParams?.['template-slug'] ?? '').toString().trim());
  const selectedTemplate: TEMPLATE | undefined = Templates.find(
    (item) => item.slug === slug
  );

  if (!selectedTemplate) {
    return <div className="p-10 text-red-500 font-bold">Template not found.</div>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-5'>
      {/* FORMSECTION */}
      <FormSection selectedTemplate={selectedTemplate}/>

      {/* OUTPUTSECTION */}
      <OutputSection/>
    </div>
  );
}

export default CreateNewContent
