import Station from './StationInterface';
import PlayerEnum from '../enums/PlayerStateEnum';

interface NRadio {
  stationList: Station[];
  station?: Station | undefined;
  player?: PlayerEnum;
  error?: string | undefined;
}

export default NRadio;