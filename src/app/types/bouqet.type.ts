export interface BouquetType {
    id: string;
    name: string;
    description: string;
    meaning: string;
    image?: string;
    price?: string;
    isAvailable?: boolean; // Optional property to indicate availability
    category?: string; // Optional property for categorization
    tags?: string[]; // Optional property for additional tags or keywords
}