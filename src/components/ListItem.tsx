import * as React from "react";
import styled from "styled-components";
import { colors, fonts, shadows, transitions } from "../styles";
import { formatDisplayAmount, sanitizeImgSrc } from "../helpers/utilities";
import {
  SListItemText,
  SListItemName,
  SListItemDescription
} from "../components/common";
import ImageWithFallback from "./ImageWithFallback";

interface IListItemStyleProps {
  onClick?: any;
}

const SListItem = styled.div<IListItemStyleProps>`
  transition: ${transitions.base};

  border-radius: 6px;
  border: 1px solid rgb(${colors.lightGrey});
  background: rgb(${colors.white});

  transform: translate3d(0, 0, 0);
  box-shadow: ${shadows.base};

  ${({ onClick }) =>
    onClick &&
    `
    cursor: pointer;
    @media (hover: hover) {
      &:hover {
        transform: translate3d(0, -1px, 0);
        box-shadow: ${shadows.hover};
      }
    }
  `}
`;

const SListItemImage = styled(ImageWithFallback)`
  margin-right: 12px;
`;

const SListItemContainer = styled.div`
  width: 100%;
  padding: 12px 4%;
  display: flex;
  justify-content: space-between;
`;

const SListItemActions = styled.div`
  width: 100%;
  display: flex;
  border-top: 1px solid rgb(${colors.lightGrey});
`;

const SListItemButton = styled.div`
  transition: ${transitions.base};
  width: 100%;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(${colors.grey45});
  font-weight: ${fonts.weight.semibold};
  border-right: 1px solid rgb(${colors.lightGrey});
  cursor: pointer;
  &:last-child {
    border-right: none;
  }
  @media (hover: hover) {
    &:hover span {
      transform: translate3d(0, -1px, 0);
    }
  }
`;

interface IListItemDetailsStyleProps {
  minWidth?: number;
  alignRight?: boolean;
  flex?: number;
}

const SListItemDetails = styled.div<IListItemDetailsStyleProps>`
  width: 100%;
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}px` : "inherit")};
  display: flex;
  align-items: center;
  justify-content: ${({ alignRight }) =>
    alignRight ? "flex-end" : "flex-start"};
  flex: ${({ flex }) => flex || "auto"};
`;

const SListItemSmallDetails = styled.div`
  width: 100%;
  text-align: right;
  font-size: ${fonts.size.medium};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const SListItemPrice = styled(SListItemSmallDetails)`
  flex: 1;
  font-weight: ${fonts.weight.semibold};
`;

interface IListItemAction {
  label: string;
  callback: (item: any) => void;
}

interface IListItemProps {
  item: any;
  actions?: IListItemAction[];
  noImage?: boolean;
  onClick?: any;
}

const ListItem = ({
  item,
  actions,
  noImage,
  onClick,
  ...props
}: IListItemProps) => (
  <SListItem onClick={onClick} {...props}>
    <SListItemContainer>
      <SListItemDetails flex={3}>
        {!noImage && (
          <SListItemImage
            size={100}
            src={sanitizeImgSrc(item.image)}
            fallbackText={item.name}
            alt={item.name}
          />
        )}
        <SListItemText>
          <SListItemName>{item.name}</SListItemName>
          <SListItemDescription>{item.description}</SListItemDescription>
        </SListItemText>
      </SListItemDetails>
      <SListItemPrice>{formatDisplayAmount(item.price, "WASM")}</SListItemPrice>
    </SListItemContainer>
    {actions && actions.length && (
      <SListItemActions>
        {actions.map((action: IListItemAction) => (
          <SListItemButton onClick={() => action.callback(item)}>
            <span>{action.label}</span>
          </SListItemButton>
        ))}
      </SListItemActions>
    )}
  </SListItem>
);

export default ListItem;
