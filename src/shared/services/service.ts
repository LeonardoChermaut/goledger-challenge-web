interface IApiError {
  message: string;
  status: number;
}

interface IPaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface IPaginationParams {
  page?: number;
  pageSize?: number;
}

abstract class BaseApiService {
  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text();

      const apiError: IApiError = {
        message: error,
        status: response.status,
      };

      throw apiError;
    }

    return response.json();
  }
}

class ApiService extends BaseApiService {
  private static instance: ApiService;

  private constructor(
    private readonly baseUrl: string = "",
    private readonly headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + btoa(`${import.meta.env.API_AUTHORIZATION || "goledger:5NxVCAjC"}`), // TODO: Corrigir pra usar o .env
    }
  ) {
    super();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }

    return ApiService.instance;
  }

  private buildQueryString(params?: IPaginationParams): string {
    if (!params) {
      return "";
    }

    const searchParams = new URLSearchParams();

    if (params.page !== undefined) {
      searchParams.append("page", params.page.toString());
    }

    if (params.pageSize !== undefined) {
      searchParams.append("pageSize", params.pageSize.toString());
    }

    const queryString = searchParams.toString();

    return queryString ? `?${queryString}` : "";
  }

  public async get<T>(
    endpoint: string,
    params?: IPaginationParams
  ): Promise<T> {
    const queryString = this.buildQueryString(params);

    const response = await fetch(`${this.baseUrl}${endpoint}${queryString}`, {
      method: "GET",
      headers: this.headers,
    });

    return this.handleResponse<T>(response);
  }

  public async post<T, D>(endpoint: string, data: D): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  public async put<T, D>(endpoint: string, data: D): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  public async delete<T, D = undefined>(
    endpoint: string,
    data?: D
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}

export const api = ApiService.getInstance();

export type { IApiError, IPaginatedResponse, IPaginationParams };
