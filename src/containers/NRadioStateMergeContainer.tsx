'use client';

import useStations from '@/hooks/useStations';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const NRadioStateMergeContainer = ({ children }: Props) => {
  const { clientStateMergeMutate } = useStations();
  
  useEffect(() => {
    clientStateMergeMutate();
  }, [clientStateMergeMutate]);

  return children;
};

export default NRadioStateMergeContainer;
