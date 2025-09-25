import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Assignment, CheckCircle, HourglassFull, AccessTime, Event, Work, SentimentNeutral } from '@mui/icons-material';

const getCardIcon = (label) => {
  switch (label) {
    case 'Total Tasks': return Assignment;
    case 'Completed Tasks': return CheckCircle;
    case 'Pending Tasks': return HourglassFull;
    case 'In Progress Tasks': return AccessTime;
    case 'Completed On Time': return CheckCircle;
    case 'Completed Late': return AccessTime;
    case 'Total Hours Worked': return Work;
    case 'Total Days': return Event;
    case 'Worked Days': return Work;
    case 'Idle Days': return SentimentNeutral;
    default: return null;
  }
};

const getCardColor = (label) => {
  switch (label) {
    case 'Total Tasks': return '#2196f3'; // Blue
    case 'Completed Tasks': return '#4caf50'; // Green
    case 'Pending Tasks': return '#ff9800'; // Orange
    case 'In Progress Tasks': return '#ffeb3b'; // Yellow
    case 'Completed On Time': return '#4caf50'; // Green
    case 'Completed Late': return '#f44336'; // Red
    case 'Total Hours Worked': return '#9c27b0'; // Purple
    case 'Total Days': return '#00bcd4'; // Cyan
    case 'Worked Days': return '#673ab7'; // Deep Purple
    case 'Idle Days': return '#795548'; // Brown
    default: return '#607d8b'; // Blue Grey
  }
};

const ProjectSummaryPanel = ({ cardData, startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Project Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
          <Grid container spacing={2}>
            {[
              { label: 'Total Tasks', value: cardData.total_tasks },
              { label: 'Completed Tasks', value: cardData.completed_tasks },
              { label: 'Pending Tasks', value: cardData.pending_tasks },
              { label: 'In Progress Tasks', value: cardData.in_progress_tasks },
              { label: 'Completed On Time', value: cardData.completed_on_time },
              { label: 'Completed Late', value: cardData.completed_late },
              { label: 'Total Hours Worked', value: cardData.total_hours_worked },
              { label: 'Total Days', value: cardData.total_days },
              { label: 'Worked Days', value: cardData.worked_days },
              { label: 'Idle Days', value: cardData.idle_days },
            ].map((item, index) => {
              const Icon = getCardIcon(item.label);
              const color = getCardColor(item.label);
              return (
                <Grid item xs={12} sm={6} md={2.4} key={index}>
                  <Card sx={{
                    background: `linear-gradient(135deg, ${color} 30%, ${color}90 100%)`,
                    color: 'white',
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                    }
                  }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '100%' }}>
                      {Icon && <Icon sx={{ fontSize: 48, mb: 1.5 }} />}
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>{item.value ?? '0'}</Typography>
                      <Typography variant="subtitle1">{item.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectSummaryPanel;