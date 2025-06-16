export default interface Station {
    readonly slug: string;
    readonly dateAdded: string;
    readonly dateUpdated: string;
    readonly title: string;
    readonly website?: string;
    readonly bitrate?: number;
    readonly tags: string[];
    readonly stream: string;
    readonly disabled?: boolean;
};
