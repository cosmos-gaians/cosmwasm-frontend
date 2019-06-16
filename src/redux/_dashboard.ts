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
import { IWallet, ITokenBalance, IContract } from "../helpers/types";
import { apiGetBalances, apiCreateContract } from "../helpers/api";

// -- Constants ------------------------------------------------------------- //
const DASHBOARD_AUTHENTICATE_REQUEST =
  "dashboard/DASHBOARD_AUTHENTICATE_REQUEST";
const DASHBOARD_AUTHENTICATE_SUCCESS =
  "dashboard/DASHBOARD_AUTHENTICATE_SUCCESS";
const DASHBOARD_AUTHENTICATE_FAILURE =
  "dashboard/DASHBOARD_AUTHENTICATE_FAILURE";

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

export const dashboardShowAuthenticateModal = () => async (dispatch: any) =>
  dispatch(modalShow(AUTHENTICATE_MODAL, { keys: loadKeys() }));

export const dashboardAuthenticate = (name: string, wallet: IWallet) => async (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: DASHBOARD_AUTHENTICATE_REQUEST });
  try {
    const address = wallet.cosmosAddress;

    let balances: ITokenBalance[] = [];

    try {
      balances = await apiGetBalances(address);
    } catch (error) {
      console.error(error); // tslint:disable-line
      dispatch(notificationShow(`Failed to get balances`, true));
    }

    dispatch({
      type: DASHBOARD_AUTHENTICATE_SUCCESS,
      payload: {
        name,
        address,
        wallet,
        balances
      }
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: DASHBOARD_AUTHENTICATE_FAILURE });
  }
};

export const dashboardShowGroupsModal = (groupJson?: any) => async (
  dispatch: any
) =>
  dispatch(
    modalShow(GROUPS_MODAL, {
      groupJson,
      onAddItem: (groupJson: any) => {
        if (groupJson) {
          dispatch(modalHide());
        }
      },
      onRemoveItem: (groupJson: any) => {
        if (groupJson) {
          dispatch(modalHide());
        }
      }
    })
  );

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
      },
      onRemoveItem: (proposal: any) => {
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
        balances: action.payload.balances
      };
    case DASHBOARD_AUTHENTICATE_FAILURE:
      return { ...state, loading: false };
    case DASHBOARD_CREATE_CONTRACT_REQUEST:
      return { ...state, loading: true };
    case DASHBOARD_CREATE_CONTRACT_SUCCESS:
      return { ...state, loading: false, contracts: action.payload };
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
