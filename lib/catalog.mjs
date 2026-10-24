import { createContext, useContext } from 'react';

// The `catalog` from content/business.mjs, passed in as a page prop and provided by pages/_app.jsx.
export const CatalogContext = createContext(null);
export const useCatalog = () => useContext(CatalogContext);
