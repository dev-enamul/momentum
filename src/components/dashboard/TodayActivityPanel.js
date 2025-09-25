import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { HourglassEmpty } from '@mui/icons-material';

const TodayActivityPanel = ({ todayActivity, totalHours }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ minHeight: 450, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Today's Activity</span>
            <Chip label={`Total Hours: ${totalHours}`} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
          </Typography>

          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <TableContainer component={Paper} sx={{ 
              maxHeight: '370px', 
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              }
            }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayActivity.length > 0 ? todayActivity.map((activity, index) => {
                    const dateOnly = activity.start_time ? new Date(activity.start_time).toLocaleDateString() : '-';
                    const formatTimeStr = (timeStr) => timeStr ? new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
                    const start = formatTimeStr(activity.start_time);
                    const end = formatTimeStr(activity.end_time);
                    return (
                      <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                        <TableCell>{activity.project || '-'}</TableCell>
                        <TableCell>{activity.task || '-'}</TableCell>
                        <TableCell>{dateOnly} <Chip label={`${start} - ${end}`} color="primary" size="small" sx={{ ml: 1, fontWeight: 'bold' }} /></TableCell>
                        <TableCell>{activity.duration || '-'}</TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Box sx={{ my: 2 }}>
                          <HourglassEmpty sx={{ fontSize: 40, color: 'grey.400' }} />
                          <Typography>No activities for today</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TodayActivityPanel;