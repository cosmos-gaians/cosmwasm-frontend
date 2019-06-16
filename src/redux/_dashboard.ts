import { modalShow, modalHide } from "./_modal";
import { notificationShow } from "./_notification";
import {
  GROUPS_MODAL,
  PROPOSALS_MODAL,
  CONTRACTS_MODAL,
  AUTHENTICATE_MODAL
} from "../constants/modals";
import { logRedux } from "../helpers/dev";
import { loadKeys } from "../helpers/keystore";
import { IWallet, ITokenAmount, IContract, IGroup } from "../helpers/types";
import {
  apiGetBalances,
  apiCreateContract,
  apiGetAllContracts,
  apiGetGroups,
  apiCreateGroup,
  apiGetAllProposals
} from "../helpers/api";

// -- Constants ------------------------------------------------------------- //
const DASHBOARD_AUTHENTICATE_REQUEST =
  "dashboard/DASHBOARD_AUTHENTICATE_REQUEST";
const DASHBOARD_AUTHENTICATE_SUCCESS =
  "dashboard/DASHBOARD_AUTHENTICATE_SUCCESS";
const DASHBOARD_AUTHENTICATE_FAILURE =
  "dashboard/DASHBOARD_AUTHENTICATE_FAILURE";

const DASHBOARD_UPDATE_DATA_REQUEST = "dashboard/DASHBOARD_UPDATE_DATA_REQUEST";
const DASHBOARD_UPDATE_DATA_SUCCESS = "dashboard/DASHBOARD_UPDATE_DATA_SUCCESS";
const DASHBOARD_UPDATE_DATA_FAILURE = "dashboard/DASHBOARD_UPDATE_DATA_FAILURE";

const DASHBOARD_GET_GROUPS_REQUEST = "dashboard/DASHBOARD_GET_GROUPS_REQUEST";
const DASHBOARD_GET_GROUPS_SUCCESS = "dashboard/DASHBOARD_GET_GROUPS_SUCCESS";
const DASHBOARD_GET_GROUPS_FAILURE = "dashboard/DASHBOARD_GET_GROUPS_FAILURE";

const DASHBOARD_GET_CONTRACTS_REQUEST =
  "dashboard/DASHBOARD_GET_CONTRACTS_REQUEST";
const DASHBOARD_GET_CONTRACTS_SUCCESS =
  "dashboard/DASHBOARD_GET_CONTRACTS_SUCCESS";
const DASHBOARD_GET_CONTRACTS_FAILURE =
  "dashboard/DASHBOARD_GET_CONTRACTS_FAILURE";

const DASHBOARD_CREATE_GROUP_REQUEST =
  "dashboard/DASHBOARD_CREATE_GROUP_REQUEST";
const DASHBOARD_CREATE_GROUP_SUCCESS =
  "dashboard/DASHBOARD_CREATE_GROUP_SUCCESS";
const DASHBOARD_CREATE_GROUP_FAILURE =
  "dashboard/DASHBOARD_CREATE_GROUP_FAILURE";

const DASHBOARD_GET_PROPOSALS_REQUEST =
  "dashboard/DASHBOARD_GET_PROPOSALS_REQUEST";
const DASHBOARD_GET_PROPOSALS_SUCCESS =
  "dashboard/DASHBOARD_GET_PROPOSALS_SUCCESS";
const DASHBOARD_GET_PROPOSALS_FAILURE =
  "dashboard/DASHBOARD_GET_PROPOSALS_FAILURE";

const DASHBOARD_CREATE_CONTRACT_REQUEST =
  "dashboard/DASHBOARD_CREATE_CONTRACT_REQUEST";
const DASHBOARD_CREATE_CONTRACT_SUCCESS =
  "dashboard/DASHBOARD_CREATE_CONTRACT_SUCCESS";
const DASHBOARD_CREATE_CONTRACT_FAILURE =
  "dashboard/DASHBOARD_CREATE_CONTRACT_FAILURE";

const DASHBOARD_VERIFY_CLAIM_REQUEST =
  "dashboard/DASHBOARD_VERIFY_CLAIM_REQUEST";
const DASHBOARD_VERIFY_CLAIM_SUCCESS =
  "dashboard/DASHBOARD_VERIFY_CLAIM_SUCCESS";
const DASHBOARD_VERIFY_CLAIM_FAILURE =
  "dashboard/DASHBOARD_VERIFY_CLAIM_FAILURE";

const DASHBOARD_UPDATE_NAME = "dashboard/DASHBOARD_UPDATE_NAME";

const DASHBOARD_CLEAR_STATE = "dashboard/DASHBOARD_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

let dataInterval: any;

function displayNotification(message: string, dispatch: any) {
  dispatch(notificationShow(`Failed to get balances`, true));
}

async function getAllData(address: string, onError: (message: string) => void) {
  let balances: ITokenAmount[] = [];

  try {
    balances = await apiGetBalances(address);
  } catch (error) {
    console.error(error); // tslint:disable-line
    onError("Failed to get balances");
  }

  const groups = await apiGetGroups(address);
  const contracts = await apiGetAllContracts();
  const proposals = await apiGetAllProposals(address);
  return { balances, groups, contracts, proposals };
}

export const dashboardShowAuthenticateModal = () => async (dispatch: any) =>
  dispatch(modalShow(AUTHENTICATE_MODAL, { keys: loadKeys() }));

export const dashboardAuthenticate = (name: string, wallet: IWallet) => async (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: DASHBOARD_AUTHENTICATE_REQUEST });
  try {
    const address = wallet.cosmosAddress;

    const { balances, groups, contracts, proposals } = await getAllData(
      address,
      (message: string) => displayNotification(message, dispatch)
    );

    dispatch({
      type: DASHBOARD_AUTHENTICATE_SUCCESS,
      payload: {
        name,
        address,
        wallet,
        balances,
        groups,
        contracts,
        proposals
      }
    });

    dispatch(dashboardSubscribeToUpdates());
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: DASHBOARD_AUTHENTICATE_FAILURE });
  }
};

export const dashboardSubscribeToUpdates = () => async (
  dispatch: any,
  getState: any
) => {
  clearInterval(dataInterval);

  async function fetchData() {
    const { address } = getState().dashboard;
    dispatch({ type: DASHBOARD_UPDATE_DATA_REQUEST });
    try {
      const { balances, groups, contracts, proposals } = await getAllData(
        address,
        (message: string) => displayNotification(message, dispatch)
      );
      dispatch({
        type: DASHBOARD_UPDATE_DATA_SUCCESS,
        payload: {
          balances,
          groups,
          contracts,
          proposals
        }
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
      dispatch(notificationShow(error.message, true));
      dispatch({ type: DASHBOARD_UPDATE_DATA_FAILURE });
    }
  }

  dataInterval = setInterval(fetchData, 1000);
};

export const dashboardGetGroups = () => async (
  dispatch: any,
  getState: any
) => {
  const { address } = getState().dashboard;
  if (!address) {
    return;
  }
  dispatch({ type: DASHBOARD_GET_GROUPS_REQUEST });
  try {
    const groups = await apiGetGroups(address);
    dispatch({
      type: DASHBOARD_GET_GROUPS_SUCCESS,
      payload: groups
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: DASHBOARD_GET_GROUPS_FAILURE });
  }
};

export const dashboardGetContracts = () => async (
  dispatch: any,
  getState: any
) => {
  const { address } = getState().dashboard;
  if (!address) {
    return;
  }
  dispatch({ type: DASHBOARD_GET_CONTRACTS_REQUEST });
  try {
    const contracts = await apiGetAllContracts();
    dispatch({
      type: DASHBOARD_GET_CONTRACTS_SUCCESS,
      payload: contracts
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: DASHBOARD_GET_CONTRACTS_FAILURE });
  }
};

export const dashboardShowGroupsModal = (group?: IGroup) => async (
  dispatch: any
) =>
  dispatch(
    modalShow(GROUPS_MODAL, {
      group,
      onAddItem: (group: IGroup, isNew: boolean) => {
        if (group) {
          // if (isNew) {
          //   dispatch(dashboardCreateGroup(group));
          // }
          dispatch(modalHide());
        }
      }
    })
  );

export const dashboardGetProposals = () => async (
  dispatch: any,
  getState: any
) => {
  const { address } = getState().dashboard;
  if (!address) {
    return;
  }
  dispatch({ type: DASHBOARD_GET_PROPOSALS_REQUEST });
  try {
    const proposals = await apiGetAllProposals(address);
    dispatch({
      type: DASHBOARD_GET_PROPOSALS_SUCCESS,
      payload: proposals
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: DASHBOARD_GET_PROPOSALS_FAILURE });
  }
};

export const dashboardShowProposalsModal = (proposal?: any) => async (
  dispatch: any
) =>
  dispatch(
    modalShow(PROPOSALS_MODAL, {
      proposal,
      onAddItem: (proposal: any) => {
        if (proposal) {
          dispatch(modalHide());
        }
      }
    })
  );

export const dashboardShowContractsModal = (contract?: IContract) => async (
  dispatch: any,
  getState: any
) =>
  dispatch(
    modalShow(CONTRACTS_MODAL, {
      address: getState().dashboard.address,
      contract,
      onAddItem: (contract: IContract, isNew: boolean) => {
        if (contract) {
          if (isNew) {
            dispatch(dashboardCreateContract(contract));
          } else {
            dispatch(dashboardVerifyClaim(contract));
          }
          dispatch(modalHide());
        }
      }
    })
  );

export const dashboardCreateGroup = (group: IGroup) => async (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: DASHBOARD_CREATE_GROUP_REQUEST });

  const groups = getState().dashboard;
  try {
    const result = await apiCreateGroup(group);
    if (result) {
      const newGroups = [...groups, group];

      dispatch({ type: DASHBOARD_CREATE_GROUP_SUCCESS, newGroups });
    } else {
      dispatch(notificationShow(`Failed to create group`, true));
      dispatch({ type: DASHBOARD_CREATE_GROUP_FAILURE });
    }
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: DASHBOARD_CREATE_GROUP_FAILURE });
  }
};

export const dashboardCreateContract = (contract: IContract) => async (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: DASHBOARD_CREATE_CONTRACT_REQUEST });

  const contracts = getState().dashboard;
  try {
    const result = await apiCreateContract(contract);
    if (result) {
      const newContracts = [...contracts, contract];

      dispatch({ type: DASHBOARD_CREATE_CONTRACT_SUCCESS, newContracts });
    } else {
      dispatch(notificationShow(`Failed to create contract`, true));
      dispatch({ type: DASHBOARD_CREATE_CONTRACT_FAILURE });
    }
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: DASHBOARD_CREATE_CONTRACT_FAILURE });
  }
};

export const dashboardVerifyClaim = (contract: IContract) => async (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: DASHBOARD_VERIFY_CLAIM_REQUEST });

  const contracts = getState().dashboard;
  try {
    const result = await apiCreateContract(contract);
    if (result) {
      const newContracts = [...contracts, contract];

      dispatch({ type: DASHBOARD_VERIFY_CLAIM_SUCCESS, newContracts });
    } else {
      dispatch(notificationShow(`Failed to create contract`, true));
      dispatch({ type: DASHBOARD_VERIFY_CLAIM_FAILURE });
    }
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: DASHBOARD_VERIFY_CLAIM_FAILURE });
  }
};

export const dashboardUpdateName = (name: string) => ({
  type: DASHBOARD_UPDATE_NAME,
  payload: name
});

export const dashboardClearState = () => ({ type: DASHBOARD_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  loading: false,
  address: "",
  name: "",
  wallet: null,
  balances: [],
  groups: [],
  proposals: [],
  contracts: []
};

export default (state = INITIAL_STATE, action: any) => {
  // TODO: DELETE THIS
  logRedux(action);
  switch (action.type) {
    case DASHBOARD_AUTHENTICATE_REQUEST:
      return { ...state, loading: true };
    case DASHBOARD_AUTHENTICATE_SUCCESS:
      return {
        ...state,
        loading: false,
        name: action.payload.name,
        address: action.payload.address,
        wallet: action.payload.wallet,
        balances: action.payload.balances,
        groups: action.payload.groups,
        contracts: action.payload.contracts,
        proposals: action.payload.proposals
      };
    case DASHBOARD_AUTHENTICATE_FAILURE:
      return { ...state, loading: false };
    case DASHBOARD_UPDATE_DATA_SUCCESS:
      return {
        ...state,
        balances: action.payload.balances,
        groups: action.payload.groups,
        contracts: action.payload.contracts,
        proposals: action.payload.proposals
      };
    case DASHBOARD_GET_GROUPS_REQUEST:
    case DASHBOARD_CREATE_GROUP_REQUEST:
      return { ...state, loading: true };
    case DASHBOARD_GET_GROUPS_SUCCESS:
    case DASHBOARD_CREATE_GROUP_SUCCESS:
      return { ...state, loading: false, groups: action.payload };
    case DASHBOARD_GET_GROUPS_FAILURE:
    case DASHBOARD_CREATE_GROUP_FAILURE:
      return { ...state, loading: false };
    case DASHBOARD_GET_PROPOSALS_REQUEST:
      return { ...state, loading: true };
    case DASHBOARD_GET_PROPOSALS_SUCCESS:
      return { ...state, loading: false, proposals: action.payload };
    case DASHBOARD_GET_PROPOSALS_FAILURE:
      return { ...state, loading: false };
    case DASHBOARD_GET_CONTRACTS_REQUEST:
    case DASHBOARD_CREATE_CONTRACT_REQUEST:
      return { ...state, loading: true };
    case DASHBOARD_GET_CONTRACTS_SUCCESS:
    case DASHBOARD_CREATE_CONTRACT_SUCCESS:
      return { ...state, loading: false, contracts: action.payload };
    case DASHBOARD_GET_CONTRACTS_FAILURE:
    case DASHBOARD_CREATE_CONTRACT_FAILURE:
      return { ...state, loading: false };
    case DASHBOARD_UPDATE_NAME:
      return { ...state, name: action.payload };
    case DASHBOARD_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
