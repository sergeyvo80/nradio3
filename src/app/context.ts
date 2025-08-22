import { createContext } from 'react';

import { StationsInterface } from '@/types/graphql/api';

export interface DataType {
  slug: string;
  stations: StationsInterface;
}

export const DataContext = createContext<DataType | null>(null);