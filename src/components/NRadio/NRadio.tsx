import Header from '../Header/Header';
import StationSelector from '../StationSelector/StationSelector';
import Station from '../Station/Station';
import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import styles from './NRadio.module.scss';
import { useCallback, useState } from 'react';
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
  onDeleteStation: (slug: string) => void;
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
  onDeleteStation,
  error,
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
        onLike={onLike}
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
