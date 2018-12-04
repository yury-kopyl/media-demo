export interface MediaModel {
    id: number;
    name: string;
    originalName: string;
    type: string;
    genre: string[];
    year: number;
    duration: string;
    description: string;
    rating: number;
    country: string[];
    premiere: string;
    director: string[];
    writers: string[];
    images: string[];
}

export interface MediaModelQuery {
    id?: number;
    name?: string;
    originalName?: string;
    type?: string;
    genre?: any;
    year?: any;
    duration?: string;
    description?: string;
    rating?: any;
    country?: string[];
    premiere?: string;
    director?: string[];
    writers?: string[];
    images?: string[];
    quality?: any;
    $text?: {
        $search: string
    };
    limit?: number;
}

export const MediaModelExample: MediaModel = {
    id: 1,
    name: '',
    originalName: '',
    type: '',
    genre: [],
    year: 1,
    duration: '',
    description: '',
    rating: 1,
    country: [],
    premiere: '',
    director: [],
    writers: [],
    images: []
};
