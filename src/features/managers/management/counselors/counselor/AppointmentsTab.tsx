import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { AppointmentReport, ContentLoading, DataTable, DateRangePicker, NavLinkAdapter, openDialog } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper, Tooltip } from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import { CheckCircle, Circle, Delete, Info, RemoveCircle, Report, Summarize, Visibility } from '@mui/icons-material';
import { useGetCounselorAppointmentsManagementQuery } from '../counselors-api';
import { Appointment } from '@/shared/types';
import dayjs from 'dayjs';
import { meetingTypeColor, statusColor } from '@/shared/constants';
import { useAppDispatch } from '@shared/store';
import { AppointmentDetail, StudentAppointmentReport } from '@/shared/pages';
function AppointmentTab() {

  const { id } = useParams()
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const dispatch = useAppDispatch()
  const { data, isLoading } = useGetCounselorAppointmentsManagementQuery({
    counselorId: Number(id),
    page: pagination.pageIndex + 1,
    fromDate: startDate,
    toDate: endDate,
  })


  const columns = useMemo<MRT_ColumnDef<Appointment>[]>(() => [
    {
      accessorFn: (row) => dayjs(row.startDateTime).format('YYYY-MM-DD'),
      header: 'Date',
    },
    {
      accessorFn: (row) => `${dayjs(row.startDateTime).format('HH:mm')} - ${dayjs(row.endDateTime).format('HH:mm')}`,
      header: 'Time',
    },
    {
      accessorKey: 'fullname',
      header: 'Student',
      Cell: ({ row }) => (
        <Typography
          component={NavLinkAdapter}
          to={`/management/students/student/${row.original.studentInfo.profile.id}`}
          className="!underline !text-secondary-main"
          color="secondary"
        >
          {row.original.studentInfo.profile.fullName}
        </Typography>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ row }) => (
        <Chip
          label={row.original.status}
          variant='filled'
          color={statusColor[row.original.status]}
          size='small'
        />

      )
    },
    {
      accessorKey: 'meetingType',
      header: 'Meeting Type',
      Cell: ({ row }) => (
        <div>
          <Chip
            label={row.original.meetingType}
            size='small'
            icon={<Circle color={meetingTypeColor[row.original.meetingType as string]} />}
            className='items-center font-semibold'
          />
          <Tooltip title={`Location: ${row.original.address || row.original.meetUrl || ''}`}>
            <Info />
          </Tooltip>
        </div>
      )
    },
  ], []);

  // if (isLoading) {
  //   return <ContentLoading />;
  // }
  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);

  return (
    <div className='space-y-8'>
      <div className='flex justify-end w-full'>
        <DateRangePicker
          startDate={startDate ? dayjs(startDate) : null}
          endDate={endDate ? dayjs(endDate) : null}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </div>
      <Paper className='shadow p-8'>

        <DataTable
          data={data?.content.data || []}
          columns={columns}
          manualPagination
          rowCount={data?.content.totalElements || 0}
          onPaginationChange={setPagination}
          state={{ pagination }}
          enableColumnFilterModes={false}
          enableGlobalFilter={false} // Disable global search
          renderRowActionMenuItems={({ closeMenu, row, table }) => [
            <MenuItem
              key={0}
              onClick={() => {
                dispatch(openDialog({
                  children: <AppointmentDetail id={row.original.id.toString()} />
                }))
                closeMenu();
                table.resetRowSelection();
              }}
            >
              <ListItemIcon>
                <Visibility />
              </ListItemIcon>
              View Detail
            </MenuItem>,
            <MenuItem
              key={1}
              onClick={() => {
                dispatch(openDialog({
                  children: <StudentAppointmentReport id={row.original.id.toString()} />
                }))
                closeMenu();
                table.resetRowSelection();
              }}
              disabled={!row.original.havingReport}
            >
              <ListItemIcon>
                <Summarize />
              </ListItemIcon>
              View Report
            </MenuItem>

          ]}
          renderTopToolbarCustomActions={({ table }) => {
            const { rowSelection } = table.getState();

            if (Object.keys(rowSelection).length === 0) {
              return null;
            }

            return (
              <div>
              </div>
            );
          }}
        />
      </Paper>
    </div>

  );
}

export default AppointmentTab;

