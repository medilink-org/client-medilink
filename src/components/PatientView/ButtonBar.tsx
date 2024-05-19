import styled from 'styled-components';

const ButtonBar = ({ activeTab, setActiveTab, style }) => (
  <StyledButtonBar className="button-bar" style={style}>
    {['Plan', 'Notes', 'Appointment Synopsis', 'Charts', 'History'].map(
      (button) => (
        <ButtonWrapper
          key={button}
          onClick={() => setActiveTab(button.toLowerCase())}
          className={activeTab === button.toLowerCase() ? 'active' : ''}
        >
          {button}
        </ButtonWrapper>
      )
    )}
  </StyledButtonBar>
);

export default ButtonBar;

const StyledButtonBar = styled.nav`
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
`;

const ButtonWrapper = styled.div`
  margin-left: 10px;
  text-align: center;
  padding: 10px 10px 10px 10px;
  width: auto;
  min-width: 100px;
  cursor: pointer;
  outline: none;
  color: white;
  background-color: #47619a;
  border: 1px solid #ddd;
  border-radius: 10px;

  &:active {
    background-color: #273554;
    color: white;
  }

  &.active {
    background-color: #273554;
    color: white;
  }

  &:hover {
    background-color: #5f7ab5;
    color: white;
  }
`;
