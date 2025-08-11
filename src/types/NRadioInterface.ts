import StationInterface from './interfaces/StationInterface';
import PlayerEnum from './PlayerStateEnum';

interface NRadioInterface {
  stationList: StationInterface[];
  station?: StationInterface | undefined;
  player?: PlayerEnum;
  error?: string | undefined;
}

export default NRadioInterface;
