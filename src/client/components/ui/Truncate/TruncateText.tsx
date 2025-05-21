'use client';

import { Truncate } from '@re-dev/react-truncate';
import { useState } from 'react';

const TruncateText = ({
  children,
  lines,
  ellipsis,
  trimWhitespace = true,
}: {
  children: React.ReactNode;
  lines: number;
  ellipsis?: React.ReactNode;
  trimWhitespace?: boolean;
}) => {
  const [isTruncated, setIsTruncated] = useState(false);

  return (
    <>
      <Truncate
        lines={lines}
        ellipsis={ellipsis}
        trimWhitespace={trimWhitespace}
        onTruncate={(truncated) => {
          setIsTruncated(truncated);
        }}
      >
        <div style={{ display: isTruncated ? 'block' : 'none' }}>
          {children}
        </div>
      </Truncate>
    </>
  );
};

export default TruncateText;
