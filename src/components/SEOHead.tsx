import React, { useEffect } from 'react';
import { getMetadataForPath, updateDOMMetadata } from '../../lib/seo/metaEngine';

export function SEOHead({ pathname }: { pathname: string }) {
  useEffect(() => {
    const meta = getMetadataForPath(pathname);
    updateDOMMetadata(meta);
  }, [pathname]);

  return null;
}
