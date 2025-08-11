import { StationsInterface } from '@/types/graphql/api';
import { createContext } from 'react';

export interface DataType {
  slug: string;
  stations: StationsInterface;
}

export const DataContext = createContext<DataType | null>(null);