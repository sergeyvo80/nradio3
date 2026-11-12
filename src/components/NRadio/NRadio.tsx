import React from 'react';
import { useCallback, useState } from 'react';

import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import NewStationInterface from '@/types/NewStationInterface';

import Header from '../Header/Header';
import StationSelector from '../StationSelector/StationSelector';
import Station from '../Station/Station';
import Modal from '../Modal/Modal';
import About from '../About/About';
import NewStation from '../NewStation/NewStation';

import styles from './NRadio.module.scss';


interface NRadioProps {
  title: string;
  station: StationInterface;
  stations: StationInterface[];
  playerState?: PlayerStateEnum;
  onPlay: () => void;
  onPause: () => void;
  onLike: (slug: string) => void;
  onNewStationAdd: (data: NewStationInterface) => void;
  onSelect: (slug: string) => void;
  error?: string;
  onDeleteStation: (slug: string) => void;
}

// эквалайзер «играет» в списке показываем только у станции,
// которая реально воспроизводится (playerState === Playing)

const NRadio = ({
  title,
  station,
  stations,
  playerState,
  onPlay,
  onPause,
  onLike,
  onNewStationAdd,
  onSelect,
  error,
  onDeleteStation,
}: NRadioProps): React.ReactNode => {
  const [isOpenAbout, setIsOpenAbout] = useState<boolean>(false);
  const [isOpenNewStation, setIsOpenNewStation] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const toggleAboutHandler = () => setIsOpenAbout(!isOpenAbout);
  const toggleOpenNewStation = useCallback(() => {
    setIsOpenNewStation(!isOpenNewStation);
    setIsSent(false);
  }, [setIsOpenNewStation, isOpenNewStation, setIsSent]);

  const handleNewStationAdd = (newStation: NewStationInterface) => {
    onNewStationAdd(newStation);
    setIsSent(true);
    // setIsOpenNewStation(false);
  };

  return (
    <div className={styles.NRadio}>
      <Header
        title={title}
        onOpenAbout={toggleAboutHandler}
        onOpenNewStation={toggleOpenNewStation}
      />
      <StationSelector
        stations={stations}
        slug={station.slug}
        // эквалайзер в списке — только у реально играющей станции
        playingSlug={playerState === PlayerStateEnum.Playing ? station.slug : undefined}
        onLike={onLike}
        onSelect={onSelect}
        onDeleteStation={onDeleteStation}
      />
      <Station
        station={station}
        playerState={playerState}
        onPlay={onPlay}
        onPause={onPause}
        onLike={onLike}
        error={error}
      />
      <Modal title="О проекте" isOpen={isOpenAbout} onClose={toggleAboutHandler}>
        <About />
      </Modal>
      <Modal title="Новая станция" isOpen={isOpenNewStation} onClose={toggleOpenNewStation}>
        <NewStation
          onNewStationAdd={handleNewStationAdd}
          isSent={isSent}
          onOkButton={toggleOpenNewStation}
        />
      </Modal>
    </div>
  );
};

NRadio.displayName = 'NRadio';

export default NRadio;
