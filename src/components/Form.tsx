import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";

const SForm = styled.form`
  width: 100%;
  display: block;
`;

class Form extends React.Component<any, any> {
  public static propTypes = {
    children: PropTypes.node.isRequired
  };
  public componentWillUnmount() {
    if (document && document.activeElement) {
      const activeElement: any = document.activeElement;
      activeElement.blur();
    }
  }
  public onSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit();
  };
  public render = () => {
    const { children, ...props } = this.props;
    return (
      <SForm noValidate onSubmit={this.onSubmit} {...props}>
        {children}
      </SForm>
    );
  };
}

export default Form;
