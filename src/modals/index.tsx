import * as React from "react";
import { connect } from "react-redux";
import Modal from "../components/Modal";
import { modalHide } from "../redux/_modal";
import {
  PLAIN_MESSAGE_MODAL,
  GROUPS_MODAL,
  PROPOSALS_MODAL,
  CONTRACTS_MODAL,
  AUTHENTICATE_MODAL
} from "../constants/modals";

import PlainMessage from "./PlainMessage";
import GroupModal from "./GroupModal";
import ProposalModal from "./ProposalModal";
import ContractModal from "./ContractModal";
import AuthenticateModal from "./AuthenticateModal";

class ModalController extends React.Component<any, any> {
  public renderModal() {
    const { name, modalProps } = this.props;
    switch (name) {
      case PLAIN_MESSAGE_MODAL:
        return <PlainMessage {...modalProps} />;
      case GROUPS_MODAL:
        return <GroupModal {...modalProps} />;
      case PROPOSALS_MODAL:
        return <ProposalModal {...modalProps} />;
      case CONTRACTS_MODAL:
        return <ContractModal {...modalProps} />;
      case AUTHENTICATE_MODAL:
        return <AuthenticateModal {...modalProps} />;

      default:
        return <div />;
    }
  }
  public render() {
    const { show, modalHide, modalProps, disableToggle } = this.props;
    return (
      <Modal
        show={show}
        toggleModal={!disableToggle ? modalHide : undefined}
        {...modalProps.modalStyleProps}
      >
        {this.renderModal()}
      </Modal>
    );
  }
}

const reduxProps = (store: any) => ({
  show: store.modal.show,
  name: store.modal.name,
  modalProps: store.modal.modalProps,
  disableToggle: store.modal.disableToggle
});

export default connect(
  reduxProps,
  { modalHide }
)(ModalController);
