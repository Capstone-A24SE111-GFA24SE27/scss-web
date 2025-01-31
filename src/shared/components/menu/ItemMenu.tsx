import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItem, ListItemText, Box, ListItemIcon } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import ReportOutlined from '@mui/icons-material/ReportOutlined';
import clsx from 'clsx';
interface MenuItemType {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean; // Optional disabled property
}

interface ItemMenuProps {
  menuItems: MenuItemType[];
  className?: string
}

const ItemMenu: React.FC<ItemMenuProps> = ({ menuItems, className = `` }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={clsx(`flex items-center`, className)}>
      {/* Menu Icon */}
      <IconButton onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => { handleClose(); item.onClick(); }}
            disabled={item.disabled} // Conditionally apply disabled
          >
            {/* Display Icon if provided */}
            {item.icon && (
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
            )}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ItemMenu;
