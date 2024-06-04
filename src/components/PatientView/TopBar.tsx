import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

// Following code is modified from Ochre example in docs https://mui.com/material-ui/customization/palette/#custom-colors
// Augment the palette to include an ochre color
declare module '@mui/material/styles' {
  interface Palette {
    blue: Palette['primary'];
  }

  interface PaletteOptions {
    blue?: PaletteOptions['primary'];
  }
}

// Update the Button's color options to include an ochre option
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    blue: true;
  }
}

const TopBar = ({ children }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <StyledTopBar>
        <Center>{children}</Center>
      </StyledTopBar>
      <Outlet />
    </div>
  );
};

const StyledTopBar = styled.div`
  display: inline-flex;
  max-width: 800px;
  box-sizing: border-box;
  z-index: 997;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export default TopBar;
