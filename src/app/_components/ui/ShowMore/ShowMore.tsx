'use client';

import { ShowMore as ShowMoreReactTruncate } from '@re-dev/react-truncate';
import { useMediaQuery } from 'react-responsive';

const ShowMore = ({
  children,
  lines = 3,
  className,
  seeMoreText = 'Voir plus',
  seeLessText = 'Voir moins',
  mediaQuery,
}: {
  children: React.ReactNode;
  lines: number;
  className?: string;
  seeMoreText?: string;
  seeLessText?: string;
  mediaQuery?: number;
}) => {
  const isUnderMediaQuery = useMediaQuery({
    maxWidth: mediaQuery ?? 0,
  });

  return (
    <ShowMoreReactTruncate
      className={className}
      lines={mediaQuery ? (isUnderMediaQuery ? lines : 0) : lines}
      more={seeMoreText}
      less={seeLessText}
    >
      {children}
    </ShowMoreReactTruncate>
  );
};

export default ShowMore;
