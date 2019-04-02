export class User {
  $key?: string;
  name: string;
  email: string;
  password: string;
  location?: {
    lat: number;
    lon: number;
  };
  admin: boolean;
  createdOn: string;
  points: number;
  photos?: string[];
  coupons?: string[];
}
