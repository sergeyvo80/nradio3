import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NRadio from '../components/NRadio/NRadio';

const stations = [
  {
    _id: '685bd20a25f8ec2dd4dfc1ae',
    name: 'Groove Salad [SomaFM]',
    slug: 'groove-salad-soma-fm',
    uuid: '',
    title: 'Groove Salad [SomaFM]',
    website: 'https://somafm.com',
    bitrate: '128',
    stream: 'http://ice1.somafm.com/groovesalad-128-mp3',
    tags: [ 'chillout, ambient' ],
    dateAdded: '2018-05-10T00:00:00.000Z',
    dateUpdated: '2018-05-10T00:00:00.000Z',
  },
  {
    _id: '685bd21e25f8ec2dd4dfc1af',
    name: 'The Trip:  Tip top tunes. [SomaFM]',
    slug: 'the-trip-tip-top-tunes-soma-fm',
    uuid: '',
    title: 'The Trip:  Tip top tunes. [SomaFM]',
    website: 'https://somafm.com',
    bitrate: '128',
    stream: 'http://ice1.somafm.com/thetrip-128-mp3',
    tags: [ 'dance' ],
    dateAdded: '2018-05-10T00:00:00.000Z',
    dateUpdated: '2018-05-10T00:00:00.000Z',
  },
  {
    _id: '685bd23125f8ec2dd4dfc1b0',
    name: 'Drone Zone [SomaFM]',
    slug: 'drone-zone-soma-fm',
    uuid: '',
    title: 'Drone Zone [SomaFM]',
    website: 'https://somafm.com',
    bitrate: '128',
    stream: 'http://ice1.somafm.com/dronezone-128-mp3',
    tags: [ 'chillout' ],
    dateAdded: '2018-05-10T00:00:00.000Z',
    dateUpdated: '2018-05-10T00:00:00.000Z',
  },
];

describe('Page', () => {
  it('renders a heading', () => {

    render(
      <NRadio
        title="NRadio"
        stations={stations}
        station={stations[0]}
        // error={error}
        // playerState={playerState}
        onPlay={() => {}}
        onPause={() => {}}
        onLike={() => {}}
        onNewStationAdd={() => {}}
        onDeleteStation={() => {}}
      />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('NRadio');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Groove Salad [SomaFM]');

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.length).toBe(3);     
  });

  
});
