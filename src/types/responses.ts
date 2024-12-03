export interface UserResponse {
  id: number;
  name: string;
  books?: {
    past: Array<{
      name: string;
      userScore: number;
    }>;
    present: Array<{
      name: string;
    }>;
  };
}

export interface BookResponse {
  id: number;
  name: string;
  score: number | -1;
} 