export class Photo {
    $key?: string;
    user_id: string;
    user_name: string;
    src: string;
    tags: string[];
    points: string[];
    location?: {
      lat: number;
      lon: number;
    };
    auth: boolean;
    createdOn: boolean;
  }
  