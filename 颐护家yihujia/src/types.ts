export type ViewType = 
  | 'home' 
  | 'recipes' 
  | 'companion' 
  | 'profile' 
  | 'appointment' 
  | 'booking' 
  | 'medication' 
  | 'sos' 
  | 'health' 
  | 'treehole'
  | 'orders'
  | 'addresses'
  | 'customer-service'
  | 'login'
  | 'article-detail';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  quickTake: string[];
  image: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  time: string;
  difficulty: string;
  calories: number;
  category: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  readTime: string;
}
