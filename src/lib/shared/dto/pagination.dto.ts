export type PaginatedResource<T> = {
    data: T[];
    page: number;
    size: number;
    totalData: number;
    totalPage: number;
};