export class Photo {
    $key?: string;
    user_id: string;
    user_name: string;
    src: string;
    tags: string[];
    points: number;
    location: {
      lat: number;
      lng: number;
    };
    auth: boolean;
    createdOn: string;
  }
  