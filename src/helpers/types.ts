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

export interface IContract {
  verifier: string;
  beneficiary: string;
  funder: string;
  payout: string;
}

export interface ITokenBalance {
  denom: string;
  amount: string;
}
