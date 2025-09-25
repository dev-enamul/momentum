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
  Card,
  CardContent,
} from '@mui/material';
import { HourglassEmpty } from '@mui/icons-material';

const WorkSummaryPanel = ({ workSummary }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>
            Work Summary
          </Typography>
          {workSummary.length > 0 ? (
            <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Projects</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workSummary.map((summary, index) => (
                    <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>{new Date(summary.date).toLocaleDateString()}</TableCell>
                      <TableCell>{summary.projects}</TableCell>
                      <TableCell>{summary.total_time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ my: 2, textAlign: 'center' }}>
              <HourglassEmpty sx={{ fontSize: 40, color: 'grey.400' }} />
              <Typography>No work summary data for the selected period</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WorkSummaryPanel;