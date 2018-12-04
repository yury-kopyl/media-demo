export interface MediaModel {
    id: number;
    name: string;
    originalName?: string;
    type?: string;
    genre?: string[];
    year?: number;
    duration?: string;
    description?: string;
    rating?: number;
    country?: string;
    premiere?: string;
    director?: string[];
    writers?: string[];
    images?: string[];
    favorite?: boolean;
}
