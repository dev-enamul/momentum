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
  Button,
  Chip,
  Card,
  CardContent,
  Tooltip,
  IconButton
} from '@mui/material';
import { HourglassEmpty, PlayArrow, CheckCircle } from '@mui/icons-material';

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 0: return 'Low';
    case 1: return 'Medium';
    case 2: return 'High';
    case 3: return 'Urgent';
    case 4: return 'Fire Urgent';
    default: return 'Unknown';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 0: return 'info'; // Blue
    case 1: return 'warning'; // Yellow
    case 2: return 'error'; // Orange
    case 3: return 'error'; // Red
    case 4: return 'error'; // Dark Red
    default: return 'default';
  }
};

const UrgentTasksPanel = ({ urgentTasks, isWorkStarted, startWorkLoading, setTaskId, handleStartWork, onCompleteTask }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>Urgent Tasks</Typography>
          <TableContainer component={Paper} sx={{ maxHeight: '250px', overflowY: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Submit Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell> 
                </TableRow>
              </TableHead>
              <TableBody>
                {urgentTasks.length > 0 ? urgentTasks.map((task) => (
                  <TableRow key={task.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>
                      <Typography variant="body2">{task.title || 'Unnamed Task'}</Typography>
                      {task.description && (
                        <Typography variant="caption" color="text.secondary">{task.description}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getPriorityLabel(task.priority)}
                        color={getPriorityColor(task.priority)}
                        size="small"
                        sx={{ fontWeight: 'bold', ...(task.priority === 4 ? { backgroundColor: '#8B0000' } : {}) }}
                      />
                    </TableCell>
                    <TableCell>{task.status || '-'}</TableCell>
                    <TableCell>{task.submit_time ? new Date(task.submit_time).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Tooltip title="Start Work">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setTaskId(task.id);
                            handleStartWork(task.id);
                          }}
                          disabled={isWorkStarted || startWorkLoading}
                        >
                          <PlayArrow />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Complete Task">
                        <IconButton
                          size="small"
                          onClick={() => onCompleteTask(task.id)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    </TableCell> 
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box sx={{ my: 2 }}>
                        <HourglassEmpty sx={{ fontSize: 40, color: 'grey.400' }} />
                        <Typography>No urgent tasks</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UrgentTasksPanel;