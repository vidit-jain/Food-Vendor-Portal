import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { message } from 'antd';
import { useNavigate } from 'react-router';
import axios from "axios";
import {logout, setToken} from "../authentication/tokens"
import {useEffect} from "react"
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [user, setUserType] = React.useState("none");
  const [wallet, setWallet] = React.useState(0);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const navigate = useNavigate();
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  useEffect(async() =>{
    let error = setToken();
    if (error !== 1) {
      let decodedtoken = await axios.post("/user/info");
      setUserType(decodedtoken.data.type);
      setToken();
      let profile = await axios.post("/user/profile")
      if (decodedtoken.data.type === "buyer") 
        setWallet(profile.data.wallet);
    }
  }, [navigate]);
	const BuyerInput = (props) => {
			if (user === "buyer") {
					return props.children;            
			}
			return null;
	}
	const VendorInput = (props) => {
			if (user === "vendor") {
					return props.children;            
			}
			return null;
	}
  const logoutUser = () => {
      logout();
      message.success("You have been successfully logged out");
      setUserType("none");
      navigate("/");
  }
  const ProfileMenu = (props) => {
    if (user !== "none") {
      return (
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="profile" onClick={() => navigate("/profile")}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <BuyerInput>
              <MenuItem key="wallet" onClick={() => navigate("/wallet")}>
                <Typography textAlign="center">Wallet</Typography>
              </MenuItem>
              </BuyerInput>
              <MenuItem key="logout" onClick={logoutUser}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
      );
    }
    else {
      return (
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="login" onClick={() => navigate("/login")}>
                <Typography textAlign="center">Login</Typography>
              </MenuItem>
              <MenuItem key="register" onClick={() => navigate("/signup")}>
                <Typography textAlign="center">Register</Typography>
              </MenuItem>
            </Menu>
      );
    }
  }
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <img src="./iiit.jpeg" height="60px" width="80px"></img> 
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem key="order" onClick={() => navigate("/food")}>
                <Typography textAlign="center">Order</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                key="dashboard"
                onClick={() => navigate("/dashboard")}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Dashboard 
              </Button>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                key="order"
                onClick={() => navigate("/orders")}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Orders 
              </Button>
          </Box>
          <BuyerInput>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <AccountBalanceWalletIcon/>₹{wallet}
            </Typography>
          </BuyerInput>

          <VendorInput>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                key="stats"
                onClick={() => navigate("/stats")}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Stats 
              </Button>
          </Box>
          </VendorInput>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>

            <ProfileMenu/>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;