import { modalShow, modalHide } from "./_modal";
import { notificationShow } from "./_notification";
import {
  GROUPS_MODAL,
  PROPOSALS_MODAL,
  CONTRACTS_MODAL
} from "../constants/modals";
import { logRedux } from "../helpers/dev";

// -- Constants ------------------------------------------------------------- //
const DASHBOARD_CONNECT_REQUEST = "dashboard/DASHBOARD_CONNECT_REQUEST";
const DASHBOARD_CONNECT_SUCCESS = "dashboard/DASHBOARD_CONNECT_SUCCESS";
const DASHBOARD_CONNECT_FAILURE = "dashboard/DASHBOARD_CONNECT_FAILURE";

const DASHBOARD_UPDATE_NAME = "dashboard/DASHBOARD_UPDATE_NAME";

const DASHBOARD_CLEAR_STATE = "dashboard/DASHBOARD_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

export const dashboardConnectWallet = (provider: any) => async (
  dispatch: any,
  getState: any
) => {
  dispatch({ type: DASHBOARD_CONNECT_REQUEST });
  try {
    const name = "";
    const address = "";
    const wallet = null;

    dispatch({
      type: DASHBOARD_CONNECT_SUCCESS,
      payload: {
        name,
        address,
        wallet
      }
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
    dispatch(notificationShow(error.message, true));
    dispatch({ type: DASHBOARD_CONNECT_FAILURE });
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
  wallet: null
};

export default (state = INITIAL_STATE, action: any) => {
  // TODO: DELETE THIS
  logRedux(action);
  switch (action.type) {
    case DASHBOARD_CONNECT_REQUEST:
      return { ...state, loading: true };
    case DASHBOARD_CONNECT_SUCCESS:
      return {
        ...state,
        loading: false,
        name: action.payload.name,
        address: action.payload.address,
        wallet: action.payload.wallet
      };
    case DASHBOARD_CONNECT_FAILURE:
      return { ...state, loading: false };
    case DASHBOARD_UPDATE_NAME:
      return { ...state, name: action.payload };

    case DASHBOARD_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
