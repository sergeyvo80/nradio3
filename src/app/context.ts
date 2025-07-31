import { StationsInterface } from '@/types/interfaces/graphql/api';
import { createContext } from 'react';

export interface DataType {
  slug: string;
  stations: StationsInterface;
}

export const DataContext = createContext<DataType | null>(null);