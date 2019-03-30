export class User {
    $key?: string;
    uid:string;
    name?:string;
    email: string;
    password: string;
    location?: {
      lat: number;
      lon: number;
    };
    admin: boolean;
    createdOn: string;
  }
  