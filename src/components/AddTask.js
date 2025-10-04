import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  AppBar,
  Toolbar,
  Autocomplete
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import PageLayout from './layout/PageLayout';

const AddTask = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [tasks, setTasks] = useState([
    { title: '', description: '', priority: 0, estimated_time: '', submit_time: '' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsRes = await apiFetch('projects?select_field=true');
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        let url = 'employees';
        if (projectId) {
          url += `?project_id=${projectId}`;
        }
        const employeesRes = await apiFetch(url);
        setEmployees(employeesRes.data || []);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };
    loadEmployees();
  }, [projectId]);

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleAddTaskRow = () => {
    setTasks([
      ...tasks,
      { title: '', description: '', priority: 0, estimated_time: '', submit_time: '' }
    ]);
  };

  const handleRemoveTaskRow = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // merge project_id & assign_to into each task
      const finalPayload = tasks.map((task) => ({
        ...task,
        project_id: projectId,
        assign_to: assignTo
      }));

      await apiFetch('tasks', { method: 'POST', body: finalPayload });
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to submit tasks:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Add Tasks">
        {/* ✅ Project select (only once) */}
        <FormControl fullWidth margin="dense">
          <Autocomplete
            options={projects}
            getOptionLabel={(option) => option.title || "Untitled Project"}
            value={projects.find((proj) => proj.id === projectId) || null}
            onChange={(event, newValue) => {
              setProjectId(newValue ? newValue.id : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Project" variant="outlined" size="small" />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>

        {/* ✅ AssignTo select (only once) */}
        <FormControl fullWidth margin="dense">
          <Autocomplete
            options={employees}
            getOptionLabel={(option) => option.name || ""}
            value={employees.find((emp) => emp.user_id === assignTo) || null}
            onChange={(event, newValue) => {
              setAssignTo(newValue ? newValue.user_id : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Assign To" variant="outlined" size="small" />
            )}
            isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
          />
        </FormControl>

        {/* 🔹 Multiple Task Rows */}
        {tasks.map((task, index) => (
          <Paper
            key={index}
            sx={{mt: 2, p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center', }}
          >
            <TextField
              label="Title *"
              required
              value={task.title}
              onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
              sx={{ flexGrow: 2 }}
              size="small"
            />
            <TextField
              label="Description"
              value={task.description}
              onChange={(e) =>
                handleTaskChange(index, 'description', e.target.value)
              }
              sx={{ flexGrow: 3 }}
              size="small"
            />
            <FormControl sx={{ flexGrow: 1 }} size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={task.priority}
                label="Priority"
                onChange={(e) =>
                  handleTaskChange(index, 'priority', e.target.value)
                }
              >
                <MenuItem value={0}>Low</MenuItem>
                <MenuItem value={1}>Medium</MenuItem>
                <MenuItem value={2}>High</MenuItem>
                <MenuItem value={3}>Urgent</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Est. Hours"
              type="number"
              value={task.estimated_time}
              onChange={(e) =>
                handleTaskChange(index, 'estimated_time', e.target.value)
              }
              sx={{ flexGrow: 1 }}
              size="small"
            />
            <TextField
              label="Submit Time"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={task.submit_time}
              onChange={(e) =>
                handleTaskChange(index, 'submit_time', e.target.value)
              }
              sx={{ flexGrow: 1 }}
              size="small"
            />
            <IconButton
              onClick={() => handleRemoveTaskRow(index)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Paper>
        ))}

        {/* Add row & Submit */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button startIcon={<Add />} onClick={handleAddTaskRow}>
            Add Another Task
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit All Tasks'}
          </Button>
        </Box>
    </PageLayout>
  );
};

export default AddTask;

