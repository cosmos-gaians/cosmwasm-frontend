import * as React from "react";
import styled from "styled-components";
import Input from "../components/Input";
import Button from "../components/Button";
import { IGroup, IGroupMember } from "../helpers/types";
import { ellipseWord } from "../helpers/utilities";
import {
  SLabel,
  SListColumn,
  SListItem,
  SListItemRow
} from "../components/common";

const SSubmitWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 24px;
  & > button:last-child {
    margin-left: 16px;
  }
  & > button:first-child {
    margin-left: 0;
  }
`;

interface IGroupModalProps {
  group: IGroup;
  onAddItem: (Group: IGroup, isNew: boolean) => void;
}

interface IGroupModalState extends IGroup {
  isNew: boolean;
}

class GroupModal extends React.Component<IGroupModalProps, IGroupModalState> {
  public state = {
    isNew: !this.props.group,
    ID: this.props.group ? this.props.group.ID : "",
    members: this.props.group ? this.props.group.members : [],
    decision_threshold: this.props.group
      ? this.props.group.decision_threshold
      : ""
  };

  public onSubmit = () => {
    const { isNew, ID, members, decision_threshold } = this.state;
    this.props.onAddItem({ ID, members, decision_threshold }, isNew);
  };

  public render() {
    const { isNew, members, decision_threshold } = this.state;
    const action = isNew ? "Create Group" : "Group";
    const readOnly = !isNew;
    return (
      <React.Fragment>
        <h6>{action}</h6>

        <Input
          readOnly={readOnly}
          type="text"
          label="Threshold"
          placeholder="Threshold"
          value={decision_threshold}
          onChange={(e: any) => this.setState({ decision_threshold })}
        />

        {isNew ? (
          <Input
            readOnly={readOnly}
            type="text"
            label="Members (CSV)"
            placeholder="Members"
            value={members.toString()}
            onChange={(e: any) =>
              this.setState({ members: e.target.value.replace(/[,;]/gi) })
            }
          />
        ) : (
          <React.Fragment>
            <SLabel>{`Members`}</SLabel>
            <SListColumn>
              <SListItem noShadow>
                <SListItemRow bold width={80}>
                  {"Address"}
                </SListItemRow>
                <SListItemRow bold alignRight width={20}>
                  {"Weight"}
                </SListItemRow>
              </SListItem>
              {members.map((member: IGroupMember) => (
                <SListItem key={`member-${member.address}`}>
                  <SListItemRow bold width={80}>
                    {ellipseWord(member.address, 40)}
                  </SListItemRow>
                  <SListItemRow bold alignRight width={20}>
                    {member.weight}
                  </SListItemRow>
                </SListItem>
              ))}
            </SListColumn>
          </React.Fragment>
        )}

        {isNew && (
          <SSubmitWrapper>
            <Button onClick={this.onSubmit}>{action}</Button>
          </SSubmitWrapper>
        )}
      </React.Fragment>
    );
  }
}

export default GroupModal;
