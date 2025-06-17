import Station from './StationInterface';
import PlayerEnum from '../enums/Player';

export default interface NRadio {
    readonly stationList: Station[];
    readonly station?: Station | undefined;
    readonly player?: PlayerEnum,
    readonly error?: string | undefined
}
