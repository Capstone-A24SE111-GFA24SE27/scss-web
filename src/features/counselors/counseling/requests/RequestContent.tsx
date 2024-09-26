import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemButton, Radio, RadioGroup, TextField, Tooltip, Typography } from '@mui/material'
import { Appointment, AppointmentAttendanceStatus, useApproveAppointmentRequestOfflineMutation, useApproveAppointmentRequestOnlineMutation, useDenyAppointmentRequestMutation, useGetCounselingAppointmentRequestsQuery, useTakeAppointmentAttendanceMutation, useUpdateAppointmentDetailsMutation } from './requests-api'
import { AppLoading, NavLinkAdapter, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, Circle, Edit, EditNote } from '@mui/icons-material';
import { Link } from 'react-router-dom'
import { Fragment, useState } from 'react';
import { useAppDispatch } from '@shared/store';
import Dialog from '@shared/components/dialog';
const RequestsContent = () => {
  const { data, isLoading } = useGetCounselingAppointmentRequestsQuery({})

  const [denyAppointmentRequest] = useDenyAppointmentRequestMutation();
  const appointmentRequests = data?.content.data
  const dispatch = useAppDispatch()

  if (isLoading) {
    return <AppLoading />
  }
  if (!appointmentRequests) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No appointment requests</Typography>
  }

  const statusColor = {
    'DENIED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success'
  }




  const handleDenyRequest = (appointment: Appointment) => {
    console.log(appointment)
    denyAppointmentRequest(appointment.id)
    dispatch(() => closeDialog())
  }

  return (
    <>
      <List className='px-16'>
        {
          appointmentRequests.map(appointment =>
            <ListItem
              key={appointment.id}
              className="p-16 flex gap-16 rounded-lg"
              sx={{ bgcolor: 'background.paper' }}
            // component={NavLinkAdapter}
            // to={`appointment/${appointment.id}`}
            >
              <div className='flex flex-col gap-16 w-full'>
                <div className='flex gap-24'>
                  <div className='flex gap-8 items-center'>
                    <AccessTime />
                    <Typography className=''>{appointment.startTime} - {appointment.endTime}</Typography>
                  </div>
                  <div className='flex gap-8 items-center '>
                    <CalendarMonth />
                    <Typography className='' >{appointment.requireDate}</Typography>
                  </div>
                </div>

                <div className='flex gap-4'>
                  {
                    appointment.meetingType === 'ONLINE' ?
                      <div className='flex gap-24 items-center'>
                        <Chip
                          label='Online'
                          icon={<Circle color='success' />}
                          className='font-semibold  items-center'
                        />
                        {appointment.appointmentDetails?.meetUrl && (
                          <div>
                            <Link to={appointment.appointmentDetails?.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
                              Meet URL
                            </Link>
                          </div>
                        )}
                      </div>
                      : appointment.appointmentDetails?.address && (<div className='flex gap-8 items-center '>
                        <Typography className='w-60'>Address:</Typography>
                        <Typography className='font-semibold'>{appointment.appointmentDetails?.address || ''}</Typography>
                      </div>)
                  }
                  {appointment.status === 'APPROVED' && (<Tooltip title={appointment.meetingType === 'ONLINE' ? 'Update meet URL' : 'Update address'}>
                    <IconButton
                      color='secondary'
                      onClick={() => dispatch(openDialog({
                        children: <UpdateDetailsAppointmentDialog appointment={appointment} />
                      }
                      ))}
                    >
                      <EditNote fontSize='medium' />
                    </IconButton>
                  </Tooltip>
                  )
                  }
                </div>
                <div className='flex gap-8'>
                  <Typography className='w-60'>Status:</Typography>
                  <Typography
                    className='font-semibold'
                    color={statusColor[appointment.status]}
                  >
                    {appointment.status}
                  </Typography>
                </div>
                <div className='flex gap-8'>
                  <Typography className='w-60'>Reason: </Typography>
                  <Typography
                    color='text.secondary'
                  >
                    {appointment.reason}
                  </Typography>
                </div>
                <ListItem
                  className='bg-primary-main/5 w-full rounded flex gap-16'
                >
                  <Avatar
                    alt={appointment.student.profile.fullName}
                    src={appointment.student.profile.avatarLink}
                  />
                  <div >
                    <Typography className='font-semibold text-primary-main'>{appointment.student.profile.fullName}</Typography>
                    <Typography color='text.secondary'>{appointment.student.email || 'counselor@fpt.edu.vn'}</Typography>
                  </div>
                </ListItem>
                {
                  appointment.status === 'WAITING' && (
                    <>
                      <Divider />
                      <div className='flex flex-col w-full justify-end gap-8 text-secondary-main '>
                        <Typography className='font-semibold'>Do you want to approve this appoitment request?</Typography>
                        <div className='flex gap-16'>
                          <Button color='error' variant='outlined' className='w-96'
                            onClick={() => dispatch(openDialog({
                              children: (
                                <div>
                                  <DialogTitle id="alert-dialog-title">Deny this appointment request?</DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      This action won't be undo.
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={() => dispatch(closeDialog())} color="primary">
                                      Cancel
                                    </Button>
                                    <Button onClick={() => {handleDenyRequest(appointment); dispatch(closeDialog())}} color="secondary" variant='contained' autoFocus>
                                      Confirm
                                    </Button>
                                  </DialogActions>
                                </div>
                              )
                            }))}
                          >
                            Deny
                          </Button>

                          <Button color='success' variant='outlined' className='w-96'
                            onClick={() => dispatch(openDialog({
                              children: (
                                <ApproveAppointmentDialog appointment={appointment} />
                              )
                            }))}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>

                    </>
                  )
                }
                {/* {
                  appointment.status === 'APPROVED' && (
                    <div className=''>
                      <Typography className='font-semibold' color='secondary'>Do the student attend the session ?</Typography>
                      <Button className='mt-8' variant='outlined' color='secondary'
                        onClick={() => dispatch(openDialog({
                          children: <CheckAttendanceDialog appointment={appointment} />
                        }
                        ))}
                      >
                        Take attendance
                      </Button>
                    </div>
                  )
                } */}
              </div>
            </ListItem >
          )}
      </List >
    </>
  )
}

const ApproveAppointmentDialog = ({ appointment }: { appointment: Appointment }) => {
  console.log(appointment.meetingType)
  const [approveAppointmentRequestOnline] = useApproveAppointmentRequestOnlineMutation();
  const [approveAppointmentRequestOffline] = useApproveAppointmentRequestOfflineMutation();
  const [meetUrl, setMeetUrl] = useState('')
  const [address, setAddress] = useState('')
  const dispatch = useAppDispatch()

  const handleApproveRequest = () => {
    const meetingDetails = {}
    if (appointment.meetingType === 'ONLINE') {
      meetingDetails['meetUrl'] = meetUrl
      approveAppointmentRequestOnline({
        requestId: appointment.id,
        meetingDetails
      })
    } else {
      meetingDetails['address'] = address
      approveAppointmentRequestOffline({
        requestId: appointment.id,
        meetingDetails
      })
    }
    dispatch(closeDialog())
  }

  return (
    <div>
      <DialogTitle id="alert-dialog-title">Approve this appointment request?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div>
            {
              appointment.meetingType === 'ONLINE' ?
                <div>
                  <Typography>The couseling appointment will be conducted ONLINE.</Typography>
                  <Typography>
                    Please enter your meet URL.
                  </Typography>
                </div>
                :
                <div>
                  <Typography>The couseling appointment will be conducted OFFLINE.</Typography>
                  <Typography>
                    Please enter your address.
                  </Typography>
                </div>
            }
          </div>
          <div>
            {
              appointment.meetingType === 'ONLINE'
                ? <TextField
                  autoFocus
                  margin="dense"
                  name={'meetUrl'}
                  label={'Meet Url'}
                  fullWidth
                  value={meetUrl}
                  variant="standard"
                  className='mt-16'
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setMeetUrl(event.target.value);
                  }} />
                : <TextField
                  autoFocus
                  margin="dense"
                  name={'address'}
                  label={'Address'}
                  fullWidth
                  value={address}
                  variant="standard"
                  className='mt-16'
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAddress(event.target.value);
                  }} />
            }
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())}
          color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleApproveRequest()}
          color="secondary" variant='contained'
          disabled={!meetUrl && !address}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}

const UpdateDetailsAppointmentDialog = ({ appointment }: { appointment: Appointment }) => {
  const [updateAppointmentDetails] = useUpdateAppointmentDetailsMutation()
  const [meetUrl, setMeetUrl] = useState(appointment.appointmentDetails.meetUrl)
  const [address, setAddress] = useState(appointment.appointmentDetails.address)
  const dispatch = useAppDispatch()

  const handleEditDetails = () => {
    const meetingDetails = {}
    if (appointment.meetingType === 'ONLINE') {
      meetingDetails['meetUrl'] = meetUrl
      updateAppointmentDetails({
        requestId: appointment.id,
        meetingDetails
      })
    } else {
      meetingDetails['address'] = address
      updateAppointmentDetails({
        requestId: appointment.id,
        meetingDetails
      })
    }
    dispatch(closeDialog())
  }

  return (
    <div className='w-[40rem]'>
      <DialogTitle id="alert-dialog-title">Edit details?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div>
            {
              appointment.meetingType === 'ONLINE' ?
                <div>
                  <Typography>Edit the current meeting URL</Typography>
                </div>
                :
                <div>
                  <Typography>Edit the current address</Typography>
                </div>
            }
          </div>
          <div>
            {
              appointment.meetingType === 'ONLINE'
                ? <TextField
                  autoFocus
                  margin="dense"
                  name={'meetUrl'}
                  label={'Meet Url'}
                  fullWidth
                  value={meetUrl}
                  variant="standard"
                  className='mt-16'
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setMeetUrl(event.target.value);
                  }} />
                : <TextField
                  autoFocus
                  margin="dense"
                  name={'address'}
                  label={'Address'}
                  fullWidth
                  value={address}
                  variant="standard"
                  className='mt-16'
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAddress(event.target.value);
                  }} />
            }
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())}
          color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleEditDetails()}
          color="secondary" variant='contained'
          disabled={!meetUrl && !address}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}

// const CheckAttendanceDialog = ({ appointment }: { appointment: Appointment }) => {
//   const dispatch = useAppDispatch()
//   const [attendanceStatus, setAttendanceStatus] = useState<AppointmentAttendanceStatus>('ATTEND')
//   const [takeAttendance] = useTakeAppointmentAttendanceMutation()

//   const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setAttendanceStatus((event.target as HTMLInputElement).value as AppointmentAttendanceStatus);
//   }

//   const handleTakeAttendance = () => {
//     takeAttendance({
//       appointmentId: appointment.id,
//       counselingAppointmentStatus: attendanceStatus as AppointmentAttendanceStatus
//     })
//     dispatch(closeDialog())
//   }

//   return (
//     <div>
//       <DialogTitle id="alert-dialog-title">Update attendance for this student</DialogTitle>
//       <DialogContent>
//         <DialogContentText id="alert-dialog-description" className='flex flex-col gap-16'>
//           <div
//             className='rounded flex justify-start gap-16'
//           >
//             <Avatar
//               alt={appointment.student.profile.fullName}
//               src={appointment.student.profile.avatarLink}
//             />
//             <div >
//               <Typography className='font-semibold text-primary-main'>{appointment.student.profile.fullName}</Typography>
//               <Typography color='text.secondary'>{appointment.student.email || 'counselor@fpt.edu.vn'}</Typography>
//             </div>
//           </div>
//           <FormControl>
//             <RadioGroup
//               aria-labelledby="demo-radio-buttons-group-label"
//               defaultValue="female"
//               name="radio-buttons-group"
//               value={attendanceStatus}
//               onChange={handleRadioChange}
//             >
//               <div className='flex gap-16'>
//                 <FormControlLabel value="ATTEND" control={<Radio color='success' />} label="Attended" className='text-black' />
//                 <FormControlLabel value="ABSENT" control={<Radio color='error' />} label="Absent" className='text-black' />
//               </div>
//             </RadioGroup>
//           </FormControl>
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={() => dispatch(closeDialog())}
//           color="primary">
//           Cancel
//         </Button>
//         <Button
//           onClick={handleTakeAttendance}
//           color="secondary" variant='contained'
//         >
//           Confirm
//         </Button>
//       </DialogActions>
//     </div>
//   )
// }

export default RequestsContent