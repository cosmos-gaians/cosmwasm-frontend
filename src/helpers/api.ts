import axios, { AxiosInstance } from "axios";
import { ITokenBalance, IContract } from "./types";

const restApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:1317",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const apiGetBalances = async (
  address: string
): Promise<ITokenBalance[]> => {
  const { data } = await restApi.get(`/bank/balances/${address}`);
  return data;
};

export const apiCreateContract = async (contract: IContract): Promise<any> => {
  const { data } = await restApi.post(`/contract/create`, contract);
  return data;
};

export const apiVerifyClaim = async (signature: any): Promise<any> => {
  const { data } = await restApi.post(`/contract/verify`, signature);
  return data;
};
