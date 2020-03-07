export interface GetAddressResponse {
  city?: string;

  countryCode?: string;

  number?: string;

  street?: string;

  zip?: string;
}

export interface CreateAddressRequest {
  city?: string;

  countryId?: number;

  number?: string;

  street?: string;

  zip?: string;
}
