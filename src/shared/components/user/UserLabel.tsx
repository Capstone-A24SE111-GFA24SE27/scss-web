import React, { useState } from 'react';
import { Box, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { Profile } from '@/shared/types';
import { useAppDispatch } from '@shared/store';
import { openDialog } from '..';
import { LocalPhoneOutlined } from '@mui/icons-material';

interface UserLabelProps {
  profile: Profile,
  label?: string,
  onClick?: () => void; // Optional onClick function
}

const UserLabel: React.FC<UserLabelProps> = ({
  profile,
  label = ``,
  onClick,
}) => {
  const dispatch = useAppDispatch()
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      dispatch(
        openDialog({
          children: <div>
            <DialogTitle>Profile Details</DialogTitle>
            <DialogContent>
              <div className='flex items-center w-full gap-16'>
                <Avatar alt={profile?.fullName} src={profile?.avatarLink} className='size-64' />
                <div>
                  <Typography className='font-semibold text-primary-main'>{profile?.fullName}</Typography>
                  <div className="flex items-center gap-16 mt-2">
                    <div className="flex items-center w-120">
                      <LocalPhoneOutlined fontSize='small' className='size-16' />
                      <div className="ml-8 text-text-secondary leading-6">{profile?.phoneNumber}</div>
                    </div>
                    {/* <div className="flex items-center">
                      <EmailOutlined fontSize='small' className='size-16' />
                      <div className="ml-8 text-text-secondary leading-6">{email || 'emailisnull@fpt.edu.vn'}</div>
                    </div> */}
                  </div>
                </div>
              </div>
            </DialogContent>
          </div>
        })
      )
    }
  };

  return (
    <div className="flex items-center px-8 text-sm text-text-secondary gap-4">
      {label}
      <Box
        className={`flex gap-8 items-center group hover:cursor-pointer`}
        onClick={handleClick} // Use handleClick for conditional onClick behavior
      >
        <Avatar className="size-24" alt={profile?.fullName} src={profile?.avatarLink} />
        <div>
          <Typography className="font-semibold group-hover:underline underline-offset-2">
            {profile?.fullName}
          </Typography>
        </div>
      </Box>

    </div>
  );
};

export default UserLabel;