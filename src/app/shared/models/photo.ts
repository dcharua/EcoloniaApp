export class Photo {
    $key?: string;
    user:string;
    src:string;
    tags: string[];
    location?: {
      lat: number;
      lon: number;
    };
    auth: boolean;
  }
  