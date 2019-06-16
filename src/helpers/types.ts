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
  payout: number;
}

export interface ITokenAmount {
  denom: string;
  amount: string;
}

export interface IGroupMember {
  address: string;
  weight: string;
}

export interface IGroup {
  ID: string;
  members: IGroupMember[];
  decision_threshold: string;
}

export interface IProposalMessage {
  type: string;
  value: {
    from_address: string;
    to_address: string;
    amount: ITokenAmount[];
  };
}

export interface IProposal {
  group: string;
  proposer: string;
  msgs: IProposalMessage;
  approvers: string[];
}
