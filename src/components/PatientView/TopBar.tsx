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
    <>
      <StyledTopBar>
        <Center>{children}</Center>
      </StyledTopBar>
      <Outlet />
    </>
  );
};

const StyledTopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin: auto;
  box-sizing: border-box;
  z-index: 997;
  padding: 0;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 50%;
`;

export default TopBar;
