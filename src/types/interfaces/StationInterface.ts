export default interface StationInterface {
  slug: string;
  dateAdded: string;
  dateUpdated: string;
  title: string;
  
  website?: string;
  bitrate?: number;
  tags: string[];
  stream: string;
  disabled?: boolean;
  isLiked?: boolean;
};
