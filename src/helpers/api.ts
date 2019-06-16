import axios, { AxiosInstance } from "axios";
import { ITokenAmount, IContract, IGroup, IProposal } from "./types";
import { isEmptyArray } from "./utilities";

const restApi: AxiosInstance = axios.create({
  baseURL: "http://199.247.5.198:1317",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const apiGetBalances = async (
  address: string
): Promise<ITokenAmount[]> => {
  const { data } = await restApi.get(`/bank/balances/${address}`);
  return data;
};

export const apiCreateGroup = async (group: IGroup): Promise<IGroup> => {
  const { data } = await restApi.post(`/group/create/`, group);
  return data;
};

export const apiGetGroups = async (address: string): Promise<IGroup[]> => {
  const { data } = await restApi.get(`/group/groups_by_member/${address}`);
  return data;
};

export const apiGetProposals = async (
  groupId: string
): Promise<IProposal[]> => {
  const { data } = await restApi.get(`/group/proposals_by_group_id/${groupId}`);
  return data;
};

export const apiGetAllProposals = async (
  address: string
): Promise<IProposal[]> => {
  const groups = await apiGetGroups(address);
  let result: IProposal[] = [];
  if (!isEmptyArray(groups)) {
    const arrays = await Promise.all(
      groups.map((group: IGroup) => apiGetProposals(group.ID))
    );
    result = arrays.flat(2);
  }
  return result;
};

export const apiGetContractList = async (): Promise<string[]> => {
  const { data } = await restApi.get(`/contracts/list`);
  return data;
};

export const apiGetContractState = async (
  address: string
): Promise<IContract> => {
  const { data } = await restApi.get(`/contracts/state/${address}`);
  return data;
};

export const apiGetAllContracts = async (): Promise<IContract[]> => {
  const list = await apiGetContractList();
  let result: IContract[] = [];
  if (!isEmptyArray(list)) {
    result = await Promise.all(
      list.map((address: string) => apiGetContractState(address))
    );
  }
  return result;
};

export const apiCreateContract = async (contract: IContract): Promise<any> => {
  const { data } = await restApi.post(`/contracts/create`, contract);
  return data;
};

export const apiVerifyClaim = async (signature: any): Promise<any> => {
  const { data } = await restApi.post(`/contracts/verify`, signature);
  return data;
};
