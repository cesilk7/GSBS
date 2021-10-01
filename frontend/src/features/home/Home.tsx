import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useTheme, Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  Avatar,
  Badge,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CreateIcon from '@mui/icons-material/Create';
import FastFoodIcon from '@mui/icons-material/Fastfood';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import Auth from '../auth/Auth';
import EditProfile from '../home/EditProfile';
import MealList from '../meal/MealList';
import DiaryCalendar from '../diary/DiaryCalendar';
import {
  selectMyProfile,
  selectIsLoadingAuth,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  editUsername,
  fetchAsyncGetMyProf,
} from '../auth/authSlice';
import styles from './Home.module.css';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    backgroundColor: '#8799de !important',
  },
}));

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectMyProfile);
  const isLoadingAuth = useAppSelector(selectIsLoadingAuth);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [activePage, setActivePage] = useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Auth />
      <EditProfile />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
            disabled={!profile?.username}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 2 }}>
            life management
          </Typography>
          {profile?.username ? (
            <>
              <div className={styles.home__logout}>
                { isLoadingAuth && <CircularProgress /> }
                <Button
                  color='inherit'
                  onClick={() => {
                    localStorage.removeItem('localJWT');
                    dispatch(editUsername(''));
                    dispatch(resetOpenProfile());
                    handleDrawerClose();
                    dispatch(setOpenSignIn());
                  }}
                >
                  Logout
                </Button>
                <button
                  className={styles.home__btnModal}
                  onClick={() => {
                    dispatch(setOpenProfile());
                  }}
                >
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                  >
                    <Avatar alt='who?' src={profile.img} />{' '}
                  </StyledBadge>
                </button>
              </div>
            </>
          ) : (
            <div>
              <Button
                color='inherit'
                onClick={() => {
                  dispatch(setOpenSignIn());
                  dispatch(resetOpenSignUp());
                }}
              >
                LogIn
              </Button>
              <Button
                color='inherit'
                onClick={() => {
                  dispatch(setOpenSignUp());
                  dispatch(resetOpenSignIn());
                }}
              >
               SignUp
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{ paper: classes.paper }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            button
            key={'Diary'}
            onClick={() => {
              setActivePage('diary');
            }}
          >
            <ListItemIcon>
              <CreateIcon className={activePage === 'diary' ? styles.home__active : ''} />
            </ListItemIcon>
            <ListItemText primary='Diary' className={activePage === 'diary' ? styles.home__active : ''} />
          </ListItem>
          <ListItem
            button
            key={'Meal'}
            onClick={() => {
              setActivePage('meal');
            }}
          >
            <ListItemIcon>
              <FastFoodIcon className={activePage === 'meal' ? styles.home__active : ''} />
            </ListItemIcon>
            <ListItemText primary='Meal' className={activePage === 'meal' ? styles.home__active : ''} />
          </ListItem>
          <ListItem
            button
            key={'Graph'}
            onClick={() => {
              setActivePage('graph');
            }}
          >
            <ListItemIcon>
              <AutoGraphIcon className={activePage === 'graph' ? styles.home__active : ''} />
            </ListItemIcon>
            <ListItemText primary='Graph' className={activePage === 'graph' ? styles.home__active : ''} />
          </ListItem>
          <ListItem
            button
            key={'Assets'}
            onClick={() => {
              setActivePage('assets');
            }}
          >
            <ListItemIcon>
              <AccountBalanceIcon className={activePage === 'assets' ? styles.home__active : ''} />
            </ListItemIcon>
            <ListItemText primary='Assets' className={activePage === 'assets' ? styles.home__active : ''} />
          </ListItem>
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {activePage === 'meal' && <MealList />}
        {activePage === 'diary' && <DiaryCalendar />}
      </Main>
    </div>
  )
}

export default Home;
