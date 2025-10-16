export interface DadataResponse {
  suggestions: DadataSuggestion[];
}

export interface DadataSuggestion {
  value: string;
  unrestricted_value: string;
  data: DadataAddressData;
}

export interface DadataAddressData {
  fias_id: string;
  region: string;
  city: string;
  street: string;
  house: string;
  flat: string;
  postal_code: string;
}