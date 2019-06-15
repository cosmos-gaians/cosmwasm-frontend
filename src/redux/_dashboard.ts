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
import { IWallet } from "../helpers/types";
import { apiGetBalances } from "../helpers/api";

// -- Constants ------------------------------------------------------------- //
const DASHBOARD_AUTHENTICATE_REQUEST =
  "dashboard/DASHBOARD_AUTHENTICATE_REQUEST";
const DASHBOARD_AUTHENTICATE_SUCCESS =
  "dashboard/DASHBOARD_AUTHENTICATE_SUCCESS";
const DASHBOARD_AUTHENTICATE_FAILURE =
  "dashboard/DASHBOARD_AUTHENTICATE_FAILURE";

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

    const balances = await apiGetBalances(address);

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

export const dashboardShowContractsModal = (contract?: any) => async (
  dispatch: any
) =>
  dispatch(
    modalShow(CONTRACTS_MODAL, {
      contract,
      onAddItem: (contract: any) => {
        if (contract) {
          dispatch(modalHide());
        }
      },
      onRemoveItem: (contract: any) => {
        if (contract) {
          dispatch(modalHide());
        }
      }
    })
  );

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
    case DASHBOARD_UPDATE_NAME:
      return { ...state, name: action.payload };
    case DASHBOARD_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
