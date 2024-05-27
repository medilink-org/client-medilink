import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';

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

const theme = createTheme({
  palette: {
    blue: {
      main: '#47619A',
      dark: '#273554'
    }
  }
});

const TopBar = ({
  logo,
  left,
  children,
  right,
  style,
  practitioner,
  showLogo = true,
  showText = false
}) => {
  return (
    <>
      <StyledTopBar style={style}>
        <Left>
          <LogoAndBrand>
            {showLogo && (
              <Logo
                to="/practitioner-home"
                state={{ practitioner: practitioner }}>
                <LogoImage src={logo} />
              </Logo>
            )}
            {showText && (
              <Brand to="/home" state={{ practitioner: practitioner }}>
                MediLink
              </Brand>
            )}
          </LogoAndBrand>
          {left}
        </Left>
        <Center>{children}</Center>
        <Right>
          {right}
          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              size="small"
              color="blue"
              disableElevation>
              <Signout to="/">Sign Out</Signout>
            </Button>
          </ThemeProvider>
        </Right>
      </StyledTopBar>
      <Outlet />
    </>
  );
};

const StyledTopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid #413b5721;
  z-index: 997;
  background: #c6d2d6;
  padding: 0;
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 25%;
  height: 100%;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 50%;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: calc(25% - 20px);
  padding-right: 20px;
`;

const LogoAndBrand = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
  padding-left: 0;
  overflow: hidden;
`;

const Logo = styled(NavLink)`
  margin: 0 7px 0 20px;
`;

const Signout = styled(NavLink)`
  text-decoration: none;
  color: white;
`;

const LogoImage = styled.img`
  margin-top: 5px;
  height: 40px;
  &:hover {
    box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;

const Brand = styled(NavLink)`
  margin-right: 60px;
  margin-left: -15px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 1px;
  user-select: none;
  font-family: 'Avenir';
  text-decoration: none;

  background: #ffffff;
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`;

export default TopBar;
