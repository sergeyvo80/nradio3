import React from 'react';
import Link from 'next/link';
import StationInterface from '../../../types/interfaces/Station';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StationListItemProps {
  readonly station: StationInterface;
  readonly isCurrent?: boolean;
}

const StationListItem = ({ station, isCurrent }: StationListItemProps) => (
  <li className={`station-list__item ${isCurrent ? 'station-list__item--current' : ''}`}>
    <Link href={`/station/${station.slug}`} className="station-list__item-a">
      <FontAwesomeIcon icon={faHeart} className="station-list__item-heart" />
      {'\u00a0'}
      {station.title}
    </Link>
  </li>
);

export default StationListItem;
