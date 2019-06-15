import axios, { AxiosInstance } from "axios";
import { ITokenBalance } from "./types";

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
