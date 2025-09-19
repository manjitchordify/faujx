import { Candidate, PublishedCandidateType } from '@/types/customer';
import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosError, AxiosResponse } from 'axios';

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
  code?: string;
}

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data?.message || axiosError.message,
        data: axiosError.response.data,
      } as ApiError;
    } else if (axiosError.request) {
      throw {
        status: 0,
        message: 'Network error',
        code: 'NETWORK_ERROR',
      } as ApiError;
    } else {
      throw {
        status: 0,
        message: axiosError.message || 'Request setup error',
        code: 'REQUEST_ERROR',
      } as ApiError;
    }
  }

  throw {
    status: 0,
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  } as ApiError;
}

export async function getPublishedCandidates(): Promise<Candidate[]> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<PublishedCandidateType[]> = await axios.get(
      `/customer/publishedcandidates`,
      config
    );
    const data = response.data.map(item => item.candidate);
    console.log('RESPONSE CANDIDATES DATA: ', data);
    return data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function getFavouriteCustomerCandidates(): Promise<Candidate[]> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<PublishedCandidateType[]> = await axios.get(
      `/customer/favorites`,
      config
    );
    console.log('FAV : ', response.data);
    const data = response.data.map(item => item.candidate);
    console.log('RESPONSE CANDIDATES DATA: ', data);
    return data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function addToCustomerFavourites(candidateId: string) {
  try {
    const config = getAuthAxiosConfig();

    const response = await axios.post(
      `/customer/favorites/${candidateId}`,
      {},
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function deleteCustomerFavourites(candidateId: string) {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.delete(
      `/customer/favorites/${candidateId}`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function getShortlistedCustomerCandidates(): Promise<Candidate[]> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<PublishedCandidateType[]> = await axios.get(
      `/customer/shortlisted`,
      config
    );
    console.log('FAV : ', response.data);
    const data = response.data.map(item => item.candidate);
    console.log('RESPONSE CANDIDATES DATA: ', data);
    return data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function addToCustomerShortlisted(candidateId: string) {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.post(
      `/customer/shortlist/${candidateId}`,
      {},
      config
    );
    console.log('RESPONSE CANDIDATES DATA: ', response.data);
    return null;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function deleteCustomerShortlisted(candidateId: string) {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.delete(
      `/customer/shortlist/${candidateId}`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
