import React from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { PlayArrow, Stop, Pause } from '@mui/icons-material';

const StartWorkPanel = ({
  isWorkStarted,
  elapsedTime,
  error,
  success,
  note,
  setNote,
  endWorkLoading,
  handleEndWork,
  projects,
  projectId,
  setProjectId,
  tasks,
  taskId,
  setTaskId,
  startWorkLoading,
  handleStartWork,
  isOnHold,
  handleHoldWork,
  handleContinueWork,
}) => {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <Box sx={{ width: 300, flexShrink: 0 }}>
      <Card sx={{ minHeight: 450, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, overflowY: 'hidden' }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>
            {isWorkStarted ? 'Work in Progress' : 'Start New Work'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress variant="determinate" value={100} size={100} sx={{ color: 'grey.300' }} />
              <CircularProgress
                variant="determinate"
                value={(elapsedTime % 60) * (100 / 60)}
                size={100}
                sx={{ color: '#1976d2', position: 'absolute', left: 0 }}
              />
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="text.secondary">{formatTime(elapsedTime)}</Typography>
                <Typography variant="caption" color="text.secondary">{isWorkStarted ? 'Running' : 'Idle'}</Typography>
              </Box>
            </Box>
          </Box>

          {error && <Alert severity="error" sx={{ mt: 1, py: 0 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 1, py: 0 }}>{success}</Alert>}

          {isWorkStarted ? (
            <>
              <TextField fullWidth label="Note" value={note} onChange={(e) => setNote(e.target.value)} sx={{ mt: 1 }} multiline rows={2} size="small" />
              {isOnHold ? (
                <Button variant="contained" color="success" onClick={handleContinueWork} sx={{ mt: 1, mr: 1 }} startIcon={<PlayArrow />} size="small">
                  Continue
                </Button>
              ) : (
                <Button variant="contained" color="warning" onClick={handleHoldWork} sx={{ mt: 1, mr: 1 }} startIcon={<Pause />} size="small">
                  Hold
                </Button>
              )}
              <Button variant="contained" color="error" onClick={() => handleEndWork(note)} sx={{ mt: 1 }} disabled={endWorkLoading} startIcon={<Stop />} size="small">
                {endWorkLoading ? 'Ending Work...' : 'End Work'}
              </Button>
            </>
          ) : (
            <>
              <FormControl fullWidth sx={{ mt: 1 }} size="small">
                <Autocomplete
                  options={projects}
                  getOptionLabel={(option) => option.title || 'Untitled Project'}
                  value={projects.find(proj => proj.id === projectId) || null}
                  onChange={(event, newValue) => setProjectId(newValue ? newValue.id : '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Project" variant="outlined" size="small" />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }} size="small">
                <Autocomplete
                  options={tasks}
                  getOptionLabel={(option) => option.title || 'Unnamed Task'}
                  value={tasks.find(task => task.id === taskId) || null}
                  onChange={(event, newValue) => setTaskId(newValue ? newValue.id : '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Task" variant="outlined" size="small" />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </FormControl>
              <TextField fullWidth label="Note" value={note} onChange={(e) => setNote(e.target.value)} sx={{ mt: 1 }} multiline rows={2} size="small" />
              <Button variant="contained" onClick={() => handleStartWork()} sx={{ mt: 1 }} disabled={startWorkLoading} startIcon={<PlayArrow />} size="small">
                {startWorkLoading ? 'Starting Work...' : 'Start Work'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StartWorkPanel;
