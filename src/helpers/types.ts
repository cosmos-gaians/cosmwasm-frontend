export interface IWallet {
  privateKey: string;
  publicKey: string;
  cosmosAddress: string;
}

export interface IKeyStore {
  name: string;
  address: string;
  wallet: string;
}

export interface IProposalJson {
  id: string;
  timestamp: number;
  type: string;
  threshold: number;
}
