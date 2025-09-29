import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CircularProgress,
  Checkbox,
  IconButton,
  Tooltip,
  Autocomplete,
  TablePagination
} from '@mui/material';
import { Edit, Delete, Add, CheckCircle, AssignmentInd } from '@mui/icons-material';
import apiFetch, { completeTask, assignTask } from '../utils/api';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import PageLayout from './layout/PageLayout';

const Tasks = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    data: tasks,
    loading: tasksLoading,
    page,
    rowsPerPage,
    totalItems: totalTasks,
    filters,
    handleFilterChange,
    handlePageChange,
    handleRowsPerPageChange,
    refetch: loadTasks,
  } = usePaginatedFetch('tasks', {
    project_filter: 'all',
    status: 'all',
    assign_by: 'all',
    assign_to: 'all',
    keyword: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadEmployees(filters.project_filter);
  }, [filters.project_filter]);

  const loadProjects = async () => {
    try {
      const response = await apiFetch('projects?select_field=true');
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const loadEmployees = async (projectId) => {
    try {
      let url = 'employees';
      if (projectId && projectId !== 'all') {
        url += `?project_id=${projectId}`;
      }
      const response = await apiFetch(url);
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleUpdate = async () => {
    setDialogLoading(true);
    try {
        await apiFetch(`tasks/${editingTask.id}`, { method: 'PUT', body: editingTask });
        loadTasks();
        setOpen(false);
        setEditingTask(null);
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    try {
      await apiFetch(`tasks/${id}`, { method: 'DELETE' });
      loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (task) => {
    setEditingTask({
      ...task,
      assign_to: task.assign_by // Make sure assign_to is populated for the dialog
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tasks.map((n) => n.id);
      setSelectedTasks(newSelecteds);
      return;
    }
    setSelectedTasks([]);
  };

  const handleSelectClick = (event, id) => {
    const selectedIndex = selectedTasks.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedTasks, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedTasks.slice(1));
    } else if (selectedIndex === selectedTasks.length - 1) {
      newSelected = newSelected.concat(selectedTasks.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedTasks.slice(0, selectedIndex),
        selectedTasks.slice(selectedIndex + 1),
      );
    }
    setSelectedTasks(newSelected);
  };

  const handleCompleteTasks = async (taskIds) => {
    if (window.confirm(`Are you sure you want to complete ${taskIds.length} task(s)?`)) {
        try {
            await completeTask(taskIds);
            loadTasks(); // Refresh tasks
        } catch (error) {
            console.error('Failed to complete task(s):', error);
            alert(`Error: ${error.message}`);
        }
    }
  };

  const handleOpenAssignModal = (taskIds) => {
    setSelectedTasks(taskIds); // Set tasks to be assigned
    setAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedEmployee('');
    setSelectedTasks([]); // Clear selection after modal closes
  };

  const handleAssignTasks = async () => {
    if (!selectedEmployee) {
        alert('Please select an employee.');
        return;
    }
    try {
        await assignTask(selectedTasks, selectedEmployee);
        handleCloseAssignModal();
        loadTasks(); // Refresh tasks
    } catch (error) {
        console.error('Failed to assign tasks:', error);
        alert(`Error: ${error.message}`);
    }
  };

  const isSelected = (id) => selectedTasks.indexOf(id) !== -1;

  const loading = tasksLoading;

  const renderAppBarActions = () => (
    <>
      {selectedTasks.length > 0 ? (
        <>
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
            {selectedTasks.length} selected
          </Typography>
          <Tooltip title="Complete Selected">
            <IconButton color="inherit" onClick={() => handleCompleteTasks(selectedTasks)}>
              <CheckCircle />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign Selected">
            <IconButton color="inherit" onClick={() => handleOpenAssignModal(selectedTasks)}>
              <AssignmentInd />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Tasks</Typography>
      )}
      <Button variant="contained" size="small" startIcon={<Add />} onClick={() => navigate('/add-task')} color="primary">Add Task</Button>
    </>
  );

  return (
    <PageLayout title={selectedTasks.length > 0 ? `${selectedTasks.length} selected` : 'Tasks'} actions={renderAppBarActions()}>
      <Card sx={{ mb: 2, backgroundColor: '#f4f6f8' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ flexGrow: 1 }} size="small">
              <Autocomplete
                options={projects}
                getOptionLabel={(option) => option.title || 'Untitled Project'}
                value={projects.find(proj => proj.id === filters.project_filter) || null}
                onChange={(event, newValue) => {
                  handleFilterChange('project_filter', newValue ? newValue.id : 'all');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Project" variant="outlined" size="small" />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </FormControl>

            <FormControl sx={{ flexGrow: 1 }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value={0}>Pending</MenuItem>
                <MenuItem value={1}>Completed</MenuItem>
                <MenuItem value={2}>In Progress</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ flexGrow: 1 }} size="small">
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => option.name || ""}
                value={employees.find(emp => emp.user_id === filters.assign_by) || null}
                onChange={(event, newValue) => {
                  handleFilterChange('assign_by', newValue ? newValue.user_id : 'all');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Assign By" variant="outlined" size="small" />
                )}
                isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
              />
            </FormControl>

            <FormControl sx={{ flexGrow: 1 }} size="small">
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => option.name || ""}
                value={employees.find(emp => emp.user_id === filters.assign_to) || null}
                onChange={(event, newValue) => {
                  handleFilterChange('assign_to', newValue ? newValue.user_id : 'all');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Assign To" variant="outlined" size="small" />
                )}
                isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
              />
            </FormControl>

            <TextField
              sx={{ flexGrow: 1 }}
              label="Keyword"
              size="small"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#f4f6f8' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                  <TableCell padding="checkbox" sx={{ fontWeight: 'bold' }}>
                      <Checkbox
                          indeterminate={selectedTasks.length > 0 && selectedTasks.length < tasks.length}
                          checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                          onChange={handleSelectAllClick}
                      />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell> 
                  <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estimated Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Time Spent</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assigned By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map(task => {
                  const isItemSelected = isSelected(task.id);
                  return (
                      <TableRow 
                          key={task.id} 
                          hover
                          onClick={(event) => handleSelectClick(event, task.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          selected={isItemSelected}
                          sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
                      >
                          <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} />
                          </TableCell>
                          <TableCell>
                          <Typography variant="subtitle1">{task.title}</Typography>
                          <Typography variant="body2" color="textSecondary">{task.description}</Typography>
                          </TableCell>
                          <TableCell>{task.project || '-'}</TableCell>
                          <TableCell>{task.priority}</TableCell>
                          <TableCell>{task.estimated_time||0} Hours</TableCell>
                          <TableCell>{task.time_spent || '-'}</TableCell>
                          <TableCell>{employees.find(e => e.user_id === task.assign_by)?.name || '-'}</TableCell>
                          <TableCell>{task.status}</TableCell>
                          <TableCell align="right">
                              <Tooltip title="Complete">
                                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCompleteTasks([task.id]); }}>
                                      <CheckCircle />
                                  </IconButton>
                              </Tooltip>
                              <Tooltip title="Assign">
                                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenAssignModal([task.id]); }}>
                                      <AssignmentInd />
                                  </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(task); }} disabled={!task.canManage}>
                                      <Edit />
                                  </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }} disabled={!task.canManage || deleteLoading[task.id]}>
                                      {deleteLoading[task.id] ? <CircularProgress size={20} /> : <Delete />}
                                  </IconButton>
                              </Tooltip>
                          </TableCell>
                      </TableRow>
                  );
              })}

            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25]}
        component="div"
        count={totalTasks}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

     {editingTask && (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
          {/* Project */}
          <FormControl fullWidth margin="dense" size="small">
              <Autocomplete
              options={projects}
              getOptionLabel={(option) => option.title || 'Untitled Project'}
              value={projects.find(proj => proj.id === editingTask.project_id) || null}
              onChange={(event, newValue) =>
                  setEditingTask({ ...editingTask, project_id: newValue ? newValue.id : '' })
              }
              renderInput={(params) => (
                  <TextField {...params} label="Project" variant="outlined" size="small" />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              />
          </FormControl>

          {/* Assign To */}
          <FormControl fullWidth margin="dense" size="small">
              <Autocomplete
              options={employees}
              getOptionLabel={(option) => option.name || ""}
              value={employees.find(emp => emp.user_id === editingTask.assign_to) || null}
              onChange={(event, newValue) =>
                  setEditingTask({ ...editingTask, assign_to: newValue ? newValue.user_id : '' })
              }
              renderInput={(params) => (
                  <TextField {...params} label="Assign To" variant="outlined" size="small" />
              )}
              isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
              />
          </FormControl>

          {/* Title */}
          <TextField
              autoFocus
              margin="dense"
              label="Title *"
              required
              fullWidth
              size="small"
              value={editingTask.title || ''}
              onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
              }
          />

          {/* Description */}
          <TextField
              margin="dense"
              label="Description"
              fullWidth
              size="small"
              multiline
              minRows={2}
              value={editingTask.description || ''}
              onChange={(e) =>
              setEditingTask({ ...editingTask, description: e.target.value })
              }
          />

          {/* Priority */}
          <FormControl fullWidth margin="dense" size="small">
              <InputLabel>Priority</InputLabel>
              <Select
              value={editingTask.priority ?? 0}
              label="Priority"
              onChange={(e) =>
                  setEditingTask({ ...editingTask, priority: e.target.value })
              }
              >
              <MenuItem value={0}>Low</MenuItem>
              <MenuItem value={1}>Medium</MenuItem>
              <MenuItem value={2}>High</MenuItem>
              <MenuItem value={3}>Urgent</MenuItem>
              </Select>
          </FormControl>

          {/* Estimated Time */}
          <TextField
              margin="dense"
              label="Estimated Time (hours)"
              type="number"
              fullWidth
              size="small"
              value={editingTask.estimated_time || ''}
              onChange={(e) =>
              setEditingTask({ ...editingTask, estimated_time: e.target.value })
              }
          />

          {/* Submit Time */}
          <TextField
              margin="dense"
              label="Submit Time"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={editingTask.submit_time || ''}
              onChange={(e) =>
              setEditingTask({ ...editingTask, submit_time: e.target.value })
              }
          />
          </DialogContent>

          <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={dialogLoading}>
              {dialogLoading ? 'Updating...' : 'Update'}
          </Button>
          </DialogActions>
      </Dialog>
      )}


      {/* Assign Task Modal */}
      <Dialog open={assignModalOpen} onClose={handleCloseAssignModal}>
          <DialogTitle>Assign Task(s)</DialogTitle>
          <DialogContent>
              <FormControl fullWidth margin="dense">
                  <Autocomplete
                      options={employees}
                      getOptionLabel={(option) => option.name || ""}
                      value={employees.find(emp => emp.user_id === selectedEmployee) || null}
                      onChange={(event, newValue) => setSelectedEmployee(newValue ? newValue.user_id : "")}
                      renderInput={(params) => (
                          <TextField {...params} label="Employee" variant="outlined" />
                      )}
                      isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
                  />
              </FormControl>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCloseAssignModal}>Cancel</Button>
              <Button onClick={handleAssignTasks}>Assign</Button>
          </DialogActions>
      </Dialog>

    </PageLayout>
  );
};

export default Tasks;
