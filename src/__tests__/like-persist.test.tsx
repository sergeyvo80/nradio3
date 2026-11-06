import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

import useStations from '@/hooks/useStations';
import getStations from '@/api/stations';
import StationInterface from '@/types/StationInterface';

// «перезагрузка страницы»: каждый новый QueryClient обязан получать СВОЮ копию json-станций
// ()getStations() отдаёт shallow-copy модульного массива - без клонирования объекты разделяются
const makeClient = async (): Promise<QueryClient> => {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const stations = await getStations();
      return JSON.parse(JSON.stringify(stations)) as StationInterface[];
    },
  });
  return qc;
};

const makeHelpers = (qc: QueryClient) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return renderHook(() => useStations(), { wrapper });
};

const likedSlugs = (stations: StationInterface[]) =>
  stations.filter((s) => s.isLiked).map((s) => s.slug);

describe('like persist', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('все лайки сохраняются в localStorage и восстанавливаются после перезагрузки', async () => {
    const slugA = 'groove-salad-soma-fm';
    const slugB = 'drone-zone-soma-fm';

    // сессия 1: два лайка
    const qc1 = await makeClient();
    const h1 = makeHelpers(qc1);
    await act(async () => {
      h1.result.current.likeMutate(slugA);
    });
    await act(async () => {
      h1.result.current.likeMutate(slugB);
    });

    const saved = JSON.parse(window.localStorage.getItem('stations') ?? '[]') as StationInterface[];
    expect(likedSlugs(saved).sort()).toEqual([slugA, slugB].sort());

    // сессия 2 (перезагрузка): merge восстанавливает оба лайка
    const qc2 = await makeClient();
    const h2 = makeHelpers(qc2);
    await act(async () => {
      await h2.result.current.clientStateMergeMutate();
    });

    const restored = qc2.getQueryData<StationInterface[]>(['stations'])!;
    expect(likedSlugs(restored).sort()).toEqual([slugA, slugB].sort());

    // повторный лайк (анлайк) корректно снимает отметку
    await act(async () => {
      h2.result.current.likeMutate(slugA);
    });
    const afterUnlike = JSON.parse(window.localStorage.getItem('stations') ?? '[]') as StationInterface[];
    expect(likedSlugs(afterUnlike)).toEqual([slugB]);
  });

  it('снятый лайк не возвращается после перезагрузки', async () => {
    const slugA = 'groove-salad-soma-fm';

    // сессия 1: лайк снят (изначально не лайкнута) → в localStorage нет isLiked
    const qc1 = await makeClient();
    const h1 = makeHelpers(qc1);
    await act(async () => {
      h1.result.current.likeMutate(slugA); // лайк
    });
    await act(async () => {
      h1.result.current.likeMutate(slugA); // снятие лайка
    });

    const saved = JSON.parse(window.localStorage.getItem('stations') ?? '[]') as StationInterface[];
    expect(likedSlugs(saved)).toHaveLength(0);

    // сессия 2: отметок нет
    const qc2 = await makeClient();
    const h2 = makeHelpers(qc2);
    await act(async () => {
      await h2.result.current.clientStateMergeMutate();
    });

    const restored = qc2.getQueryData<StationInterface[]>(['stations'])!;
    expect(likedSlugs(restored)).toHaveLength(0);
  });

  it('пользовательские (локальные) станции переживают перезагрузку, json-станции не получают метку local', async () => {
    const qc1 = await makeClient();
    const h1 = makeHelpers(qc1);
    await act(async () => {
      h1.result.current.newStationMutate({
        uuid: 'test-uuid-1',
        slug: 'my-station',
        title: 'My Station',
        description: '',
        website: '',
        tags: [],
        stream: 'https://example.com/stream.mp3',
      });
    });

    const qc2 = await makeClient();
    const h2 = makeHelpers(qc2);
    await act(async () => {
      await h2.result.current.clientStateMergeMutate();
    });

    const restored = qc2.getQueryData<StationInterface[]>(['stations'])!;

    const local = restored.find((s) => s.slug === 'my-station');
    expect(local).toBeDefined();
    expect(local?.isLocal).toBe(true);

    // json-станция не помечена как локальная
    const fromJson = restored.find((s) => s.slug === 'groove-salad-soma-fm');
    expect(fromJson?.isLocal).toBe(false);
  });
});
