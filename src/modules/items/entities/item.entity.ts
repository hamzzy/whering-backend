export enum ItemCategory {
  TOPS = 'tops',
  BOTTOMS = 'bottoms',
  DRESSES = 'dresses',
  OUTERWEAR = 'outerwear',
  SHOES = 'shoes',
  ACCESSORIES = 'accessories',
}

export class Item {
  id: string;
  category: ItemCategory;
  colour: string;
  user_id: string;
  brand: string;
  size: string;
  image_url: string;
  purchase_date: Date;
  purchase_price: number;
  createdAt: Date;
  updatedAt: Date;
}
