'use client';

import { useState, useEffect } from 'react';
import { db, ref, get, set } from '@/lib/firebase'; 
import uploadImageToSupabase from '@/lib/uploadImageToSupabase';
import { useRouter } from 'next/navigation';



export default function AdminPage({ params }) {
  const [form1, setForm1] = useState({ title: '', subtitle: '', image: null});
  const [form2, setForm2] = useState({ title: '', subtitle: '', image: null});
  const [form3, setForm3] = useState({ title: '', subtitle: '', image: null});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
     if (params.id !== 'qwerty') {
      router.push('/');
      };

    const fetchForms = async () => {
      try {
        const form1Ref = ref(db, 'pdfsExDropGuy/form1');
        const form2Ref = ref(db, 'pdfsExDropGuy/form2');
        const form3Ref = ref(db, 'pdfsExDropGuy/form3');

        const [form1Snapshot, form2Snapshot, form3Snapshot] = await Promise.all([
          get(form1Ref),
          get(form2Ref),
          get(form3Ref),
        ]);

        const form1Data = form1Snapshot.val();
        const form2Data = form2Snapshot.val();
        const form3Data = form3Snapshot.val();
        
        if (form1Data) setForm1((prev) => ({ ...prev, ...form1Data }));
        if (form2Data) setForm2((prev) => ({ ...prev, ...form2Data }));
        if (form3Data) setForm3((prev) => ({ ...prev, ...form3Data }));
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, [params.id]);

  const handleImageChange = (e, form, setForm) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
    }
  };

  const handleSubmit = async (e, form, setForm, formId) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formRef = ref(db, `pdfsExDropGuy/${formId}`);
      const snapshot = await get(formRef);
      const existingData = snapshot.val() || {};

      let updatedData = { ...existingData };

      if (form.title) updatedData.title = form.title;
      if (form.subtitle) updatedData.subtitle = form.subtitle;

      if (form.image) {
        updatedData.imageUrl = await uploadImageToSupabase(form.image);
      }

      await set(formRef, updatedData);

      console.log(`Form ${formId} updated successfully!`);
      alert(`Form ${formId} updated successfully!`);

      setForm({ title: '', subtitle: '', image: null, imageUrl: '' });
    } catch (error) {
      console.error('Error updating form:', error);
      alert('Failed to update form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-fit bg-[#121212] text-white p-8">
      <h1 className="text-3xl font-bold mb-8 sm:text-center">Admin Dashboard</h1>
      <div className="space-y-8 w-full sm:flex sm:flex-col sm:items-center">
    <form
          onSubmit={(e) => handleSubmit(e, form1, setForm1, 'form1')}
          className="bg-[#81818117] backdrop-blur-lg p-6 rounded-lg shadow-lg max-w-[500px]"
        >
          <h2 className="text-xl font-semibold mb-4">Header</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Head Title"
              value={form1.title}
              onChange={(e) => setForm1({ ...form1, title: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Head Subtitle"
              value={form1.subtitle}
              onChange={(e) => setForm1({ ...form1, subtitle: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              onChange={(e) => handleImageChange(e, form1, setForm1)}
              className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
           <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>

        <form
          onSubmit={(e) => handleSubmit(e, form2, setForm2, 'form2')}
          className="bg-[#81818117] backdrop-blur-lg p-6 rounded-lg shadow-lg max-w-[500px]"
        >
          <h2 className="text-xl font-semibold mb-4">PDF 1</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="PDF Title"
              value={form2.title}
              onChange={(e) => setForm2({ ...form2, title: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="PDF Subtitle"
              value={form2.subtitle}
              onChange={(e) => setForm2({ ...form2, subtitle: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              onChange={(e) => handleImageChange(e, form2, setForm2)}
              className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
    
      <form
          onSubmit={(e) => handleSubmit(e, form3, setForm3, 'form3')}
          className="bg-[#81818117] backdrop-blur-lg p-6 rounded-lg shadow-lg max-w-[500px]"
        >
          <h2 className="text-xl font-semibold mb-4">PDF 2</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="PDF Title"
              value={form3.title}
              onChange={(e) => setForm3({ ...form3, title: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="PDF Subtitle"
              value={form3.subtitle}
              onChange={(e) => setForm3({ ...form3, subtitle: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              onChange={(e) => handleImageChange(e, form3, setForm3)}
              className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
                             }


