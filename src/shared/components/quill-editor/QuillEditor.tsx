import React, { useRef, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-editor.css';
import clsx from 'clsx';

import { LinearProgress, Box, Typography } from '@mui/material';
import { uploadFile } from '@shared/services';

const QuillEditor = ({
  value,
  onChange,
  error,
  label,
  placeholder = "Write your content here...",
  className = "",
  customModules
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  customModules?: object;
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  console.log(value)
  // Handle image upload
  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input && input.files && input.files[0]) {
        const file = input.files[0];
        const path = `images/${Date.now()}_${file.name}`;
        console.log(`Image`, path);

        try {
          const quill = quillRef.current?.getEditor();
          if (!quill) {
            return;
          }

          const range = quill.getSelection();
          if (!range) {
            return;
          }

          // Insert a placeholder image at the current cursor position
          const placeholderImageUrl = '/assets/images/placeholders/uploading-image.jpeg';
          quill.insertEmbed(range.index, 'image', placeholderImageUrl);

          // Keep track of the placeholder node
          const placeholderImage = quill.root.querySelector(`img[src="${placeholderImageUrl}"]`) as HTMLImageElement;
          if (!placeholderImage) {
            return;
          }

          placeholderImage.style.maxWidth = '52rem';
          placeholderImage.style.minWidth = '24rem';
          placeholderImage.style.borderRadius = '4px';
          placeholderImage.style.height = 'auto';

          const downloadURL = await uploadFile(file, path, (progress) => {
            setUploadProgress(progress);
            placeholderImage.title = `Uploading: ${progress}%`;
          });

          if (downloadURL) {
            placeholderImage.src = downloadURL as string;
            placeholderImage.removeAttribute('title');
          }


        } catch (error) {
          console.error("Image upload failed:", error);
        }
      }
    };
  }, []);

  const modules = customModules
    || {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['image'], // Add image button in the toolbar
      ],
      handlers: {
        image: handleImageUpload, // Custom handler for image upload
      },
    },
  };

  return (
    <div className="mt-4">
      {
        label && < Typography className='text-text-secondary' gutterBottom>
          {label}:
        </Typography>
      }
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className={clsx(`quill-editor !text-xl`, className)}
      // style={{
      //   borderRadius: '8px',
      //   border: '1px solid #ccc',
      //   padding: '8px',
      // }}
      />

      {
        uploadProgress > 0 && uploadProgress < 100 && (
          <Box className="w-full mt-16">
            <Typography color='secondary'>Uploading image...</Typography>
            <LinearProgress variant="determinate" value={uploadProgress} color="secondary" />
          </Box>
        )
      }

      {error && <Typography color="error" className='mt-16'>{error}</Typography>}

    </div >
  );
};

export default QuillEditor;
