"use client"
import React, { useState } from 'react'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface PROPS{
    selectedTemplate?:TEMPLATE;
}

function FormSection({selectedTemplate}: PROPS) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const onSubmit =(e:any)=>{
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
  }

  return (
    <div className='p-5 shadow-md border rounded-lg bg-white'>
      {/* @ts-ignore */}
      <Image src={selectedTemplate?.icon}
      alt='icon' width={70} height={70} />

      <h2 className='font-bold text-2xl mb-2 text-primary'>
        {selectedTemplate?.name}</h2>
      <p className='text-gray-500 text-sm'>{selectedTemplate?.desc}</p>
      <form className='mt-6' onSubmit={onSubmit}>
        {selectedTemplate?.form?.map((field) => (
          <div key={field.name} className='mb-4'>
            <label className='font-bold block mb-2'>{field.label}</label>

            {field.field === 'input' ? (
              <Input
                name={field.name}
                required={Boolean(field.required)}
                onChange={handleInputChange}
              />
            ) : field.field === 'textarea' ? (
              <Textarea
                name={field.name}
                required={Boolean(field.required)}
                onChange={handleInputChange}
              />
            ) : null}
          </div>
        ))}
        <Button type="submit" className='mt-6 w-full py-6'>Generate Content</Button>
      </form>
    </div>
  )
}

export default FormSection
