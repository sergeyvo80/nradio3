import Header from '../Header/Header';
import StationSelector from '../StationSelector/StationSelector';
import Station from '../Station/Station';
import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import styles from './NRadio.module.scss';
import { useState } from 'react';
import Modal from '../Modal/Modal';
import About from '../About/About';
import NewStation from '../NewStation/NewStation';
import NewStationInterface from '@/types/NewStationInterface';

interface NRadioProps {
  title: string;
  station: StationInterface;
  stations: StationInterface[];
  playerState: PlayerStateEnum | undefined;
  onPlay: () => void;
  onPause: () => void;
  onLike: (slug: string) => void;
  onNewStationAdd: (data: NewStationInterface) => void;
  error: string | undefined;
}

const NRadio = ({
  title,
  station,
  stations,
  playerState,
  onPlay,
  onPause,
  onLike,
  onNewStationAdd,
  error,
}: NRadioProps): React.ReactNode => {
  const [isOpenAbout, setIsOpenAbout] = useState<boolean>(false);
  const [isOpenNewStation, setIsOpenNewStation] = useState<boolean>(false);
  const toggleAboutHandler = () => setIsOpenAbout(!isOpenAbout);
  const toggleOpenNewStation = () => setIsOpenNewStation(!isOpenNewStation);

  const handleNewStationAdd = (newStation: NewStationInterface) => {
    onNewStationAdd(newStation);
    setIsOpenNewStation(false);
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
        onLike={onLike}
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
        <NewStation onNewStationAdd={handleNewStationAdd} />
      </Modal>
    </div>
  );
};

NRadio.displayName = 'NRadio';

export default NRadio;
