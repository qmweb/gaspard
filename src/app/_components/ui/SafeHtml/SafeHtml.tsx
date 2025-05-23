'use client';

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

const SafeHtml = ({ htmlContent }: { htmlContent: string }) => {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    const cleanHtml = DOMPurify.sanitize(htmlContent);
    setSanitizedHtml(cleanHtml);
  }, [htmlContent]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default SafeHtml;
