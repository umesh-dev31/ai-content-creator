import React from 'react'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Templates from '@/app/(data)/Templates'
import ContentGenerator from './ContentGenerator'

async function CreateNewContent({ params }: { params: Promise<{ 'template-slug': string }> }) {
  const awaitedParams = await params;
  const slug = decodeURIComponent((awaitedParams?.['template-slug'] ?? '').toString().trim());
  const selectedTemplate: TEMPLATE | undefined = Templates.find(
    (item) => item.slug === slug
  );

  if (!selectedTemplate) {
    return <div className="p-10 text-red-500 font-bold">Template not found.</div>;
  }

  return <ContentGenerator selectedTemplate={selectedTemplate} />;
}

export default CreateNewContent
