export interface SubmitterEvent extends Event {
  submitter: HTMLElement;
}

export interface SieveModel {
  filters?: string;
  sorts?: string;
  page?: number;
  pageSize?: number;
}

export interface IPagedResult<T> {
  results: T[],
  currentPage: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
}

export interface PackageAuthViewModel {
  id: string;
  username: string;
  password: string;
}
