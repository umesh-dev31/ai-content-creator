"use client"
import React, { useState } from 'react'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';

interface PROPS{
    selectedTemplate?:TEMPLATE;
    userFormInput:any,
    loading:boolean
}

function FormSection({selectedTemplate,  userFormInput, loading}: PROPS) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted! FormData:', formData); // Debug log
    if (userFormInput && typeof userFormInput === 'function') {
      userFormInput(formData);
    } else {
      console.error('userFormInput is not a function:', userFormInput);
    }
  }

  return (
    <div className='p-5 shadow-md border border-white/10 rounded-lg bg-white/5'>
      {/* @ts-ignore */}
      <Image src={selectedTemplate?.icon}
      alt='icon' width={70} height={70} />

      <h2 className='font-bold text-2xl mb-2 text-white'>
        {selectedTemplate?.name}</h2>
      <p className='text-gray-400 text-sm'>{selectedTemplate?.desc}</p>
      <form className='mt-6' onSubmit={onSubmit}>
        {selectedTemplate?.form?.map((field) => (
          <div key={field.name} className='mb-4'>
            <label className='font-bold block mb-2 text-white'>{field.label}</label>

            {field.field === 'input' ? (
              <Input
                name={field.name}
                value={formData[field.name] || ''}
                required={Boolean(field.required)}
                onChange={handleInputChange}
                className='bg-white/10 border-white/20 text-white placeholder:text-gray-500'
              />
            ) : field.field === 'textarea' ? (
              <Textarea
                name={field.name}
                value={formData[field.name] || ''}
                required={Boolean(field.required)}
                onChange={handleInputChange}
                className='bg-white/10 border-white/20 text-white placeholder:text-gray-500'
              />
            ) : null}
          </div>
        ))}
        <Button type="submit"
         className='mt-6 w-full py-6 bg-red-600 hover:bg-red-700 text-white'
         disabled={loading}>
          {loading&&<Loader2Icon className='animate-spin' />}
          Generate Content</Button>
      </form>
    </div>
  )
}

export default FormSection
