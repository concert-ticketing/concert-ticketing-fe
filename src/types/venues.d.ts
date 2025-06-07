export interface Venue {
  id: string;
  name: string;
  location: string;
  description: string;
  floorCount: number;
  totalSeats: number;
  status: 'active' | 'draft' | 'archived';
  thumbnail: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
}
