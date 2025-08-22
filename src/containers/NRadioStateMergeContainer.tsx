'use client';

import React, { useEffect } from 'react';

import useStations from '@/hooks/useStations';

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
