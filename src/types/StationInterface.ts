interface StationInterface {
  _id?: string; 
  slug: string;
  uuid?: string;
  dateAdded: string;
  dateUpdated: string;
  title: string;
  website?: string;
  bitrate?: string;
  tags: string[];
  stream: string;
  disabled?: boolean;
  isLiked?: boolean;
}

export default StationInterface;
