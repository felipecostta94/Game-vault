export interface Game{
    id: number;
    name: string;
    slug: string;
    background_image: string;
    rating: number;
    metacritic: number;
    released: string;
    genres: { id: number; name: string } [];
}

export interface GameDetailsType extends Game{
    description_raw: string;
    website: string;
    publishers: { name: string } [];
    developers: { name: string } [];
}