export interface GithubResponse {
  data: GithubEmailEntry[];
}

export interface GithubEmailEntry {
  email: string;
  visibility: string | null;
}
