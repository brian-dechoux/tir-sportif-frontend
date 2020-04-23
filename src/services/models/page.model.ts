export interface Page<T> {
  content: Array<T>;

  empty?: boolean;

  first?: boolean;

  last?: boolean;

  number?: number;

  numberOfElements?: number;

  pageable: Pageable;

  size?: number;

  sort?: Sort;

  totalElements: number;

  totalPages: number;
}

export function EMPTY_PAGE(): Page<any> {
  return {
    content: [],
    pageable: {
      pageSize: 10,
      pageNumber: -1,
    },
    totalPages: 1,
    totalElements: 0,
  };
}

export interface Pageable {
  offset?: number;

  pageNumber: number;

  pageSize: number;

  paged?: boolean;

  sort?: Sort;

  unpaged?: boolean;
}

export interface Sort {
  empty?: boolean;

  sorted?: boolean;

  unsorted?: boolean;
}
