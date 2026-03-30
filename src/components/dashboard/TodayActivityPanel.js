import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

const TodayActivityPanel = ({ todayTasks, handleStartWork, setProjectId, setTaskId }) => {
  const handlePlayClick = (task) => {
    setProjectId(task.project_id);
    setTaskId(task.id);
    handleStartWork(task.id, task.project_id, '');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ minHeight: 450, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
            Today's Tasks
          </Typography>
          {todayTasks.length > 0 ? (
            <List>
              {todayTasks.map((task, index) => (
                <ListItem key={task.id ?? task.task_id ?? index} divider>
                  <ListItemText
                    primary={task.title}
                    secondary={`Project: ${task.project_name} | Assigned by: ${task.assigned_by} | Estimate: ${task.estimate_time}`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Start Work">
                      <IconButton edge="end" aria-label="start work" onClick={() => handlePlayClick(task)}>
                        <PlayArrow />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography>No tasks for today</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TodayActivityPanel;