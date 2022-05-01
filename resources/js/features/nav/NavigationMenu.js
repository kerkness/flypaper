import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider, IconButton, ListItemIcon } from '@mui/material';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublishIcon from '@mui/icons-material/Publish';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Slideshow from '@mui/icons-material/Slideshow';
import InfoIcon from '@mui/icons-material/Info';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import { useHistory, useLocation } from "react-router-dom";
import { useNav } from "../nav/navSlice";
import queryString from 'query-string';
import { useAuth } from "../admin/authSlice";


export default function NavigationMenu() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const { toggleDrawer, showFilter, setShowFilter } = useNav();
  const { isUser, user } = useAuth();
  const open = Boolean(anchorEl);
  const history = useHistory();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleInfo = (event) => {
    toggleDrawer('info', true);
    handleClose();
    // openInfo();
  }
  const handleSort = (newSort) => {
    pushWithQuery({
      ...getParams(),
      'sort': newSort
    })
    handleClose();
  }
  const getParams = () => {
    return queryString.parse(location.search);
  }

  const pushWithQuery = (params) => {
    history.push(params ? `/?${queryString.stringify(params)}` : `/`)
  }
  const goto = (page) => {
    if (!isUser) {
      toggleDrawer('login', true);
      return;
    }

    history.push(`/${page}`);
  }
  const gotoUserPaper = () => {
    if (!isUser) {
      toggleDrawer('login', true);
      return;
    }
    pushWithQuery({
      search: user.name,
      sort: 'created_at'
    })
    handleClose();
  }

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleSort('created_at')}>
          <ListItemIcon>
            <FiberNewIcon fontSize="small" />
          </ListItemIcon>
          Most Recent
        </MenuItem>
        <MenuItem onClick={() => handleSort('featured')}>
          <ListItemIcon>
            <StarIcon fontSize="small" />
          </ListItemIcon>
          Featured
        </MenuItem>
        <MenuItem onClick={() => handleSort('likes_count')}>
          <ListItemIcon>
            <ThumbUpIcon fontSize="small" />
          </ListItemIcon>
          Popular</MenuItem>
        <MenuItem onClick={() => handleSort('downloads_count')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Most Downloaded</MenuItem>
        <Divider />
        <MenuItem onClick={() => goto('liked')}>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          Your Favorite</MenuItem>
        <MenuItem onClick={gotoUserPaper}>
          <ListItemIcon>
            <PublishIcon fontSize="small" />
          </ListItemIcon>
          Your Paper</MenuItem>
        <Divider />
        {/* <MenuItem onClick={handleClose}>
        <ListItemIcon>
            <AutoAwesomeMosaicIcon fontSize="small" />
          </ListItemIcon>
          Grid View</MenuItem>*/}
        <MenuItem onClick={() => {
          history.push('/play')
          handleClose()
        }}>
          <ListItemIcon>
            <Slideshow fontSize="small" />
          </ListItemIcon>
          Slideshow</MenuItem>
        <MenuItem onClick={() => {
          history.push(`/desktop`)
          handleClose()
        }}>
          <ListItemIcon>
            <InstallDesktopIcon fontSize="small" />
          </ListItemIcon>
          FlyTrap Desktop</MenuItem>
        <MenuItem onClick={toggleInfo}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          About</MenuItem>
      </Menu>
    </div>
  );
}