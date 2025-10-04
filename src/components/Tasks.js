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
  TablePagination,
  Grid,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Edit, Delete, Add, CheckCircle, AssignmentInd, Info, Schedule, HourglassEmpty, Person, PriorityHigh, Folder as ProjectIcon, MoreVert } from '@mui/icons-material';
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
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const authUserId = user ? user.id : null;

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
    let submitTime = '';
    if (task.submit_time) {
      const parts = task.submit_time.split(/[- :]/);
      if (parts.length >= 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);
        const date = new Date(Date.UTC(year, month, day));
        submitTime = date.toISOString().split('T')[0];
      }
    }

    const formattedTask = {
      ...task,
      priority: task.priority_id, // Use priority_id for the Select component
      submit_time: submitTime
    };

    setEditingTask(formattedTask);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleOpenDetailsModal = (task) => {
    setSelectedTaskDetails(task);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedTaskDetails(null);
  };

  const handleMenuOpen = (event, taskId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

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
            <IconButton color="secondary" onClick={() => handleCompleteTasks(selectedTasks)}>
              <CheckCircle />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign Selected">
            <IconButton color="secondary" onClick={() => handleOpenAssignModal(selectedTasks)}>
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Assign To</TableCell>
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
                          </TableCell>
                          <TableCell>{task.project || '-'}</TableCell>
                          <TableCell>{task.priority}</TableCell>
                          <TableCell>{task.estimated_time||0} Hours</TableCell>
                          <TableCell>{task.time_spent || '-'}</TableCell>
                          <TableCell>{task.assign_by === authUserId ? 'You' : (employees.find(e => e.user_id === task.assign_by)?.name || '-')}</TableCell>
                          <TableCell>{task.assign_to === authUserId ? 'You' : (employees.find(e => e.user_id === task.assign_to)?.name || '-')}</TableCell>
                          <TableCell>{task.status}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              aria-label="more"
                              aria-controls="long-menu"
                              aria-haspopup="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuOpen(e, task.id);
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                            <Menu
                              id="long-menu"
                              anchorEl={anchorEl}
                              keepMounted
                              open={Boolean(anchorEl && selectedTaskId === task.id)}
                              onClose={handleMenuClose}
                            >
                              <MenuItem onClick={() => { handleOpenDetailsModal(task); handleMenuClose(); }}>
                                <ListItemIcon>
                                  <Info fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Details</ListItemText>
                              </MenuItem>
                              <MenuItem onClick={() => { handleCompleteTasks([task.id]); handleMenuClose(); }}>
                                <ListItemIcon>
                                  <CheckCircle fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Complete</ListItemText>
                              </MenuItem>
                              <MenuItem onClick={() => { handleOpenAssignModal([task.id]); handleMenuClose(); }}>
                                <ListItemIcon>
                                  <AssignmentInd fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Assign</ListItemText>
                              </MenuItem>
                              <MenuItem onClick={() => { handleEdit(task); handleMenuClose(); }} disabled={!task.canManage}>
                                <ListItemIcon>
                                  <Edit fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Edit</ListItemText>
                              </MenuItem>
                              <MenuItem onClick={() => { handleDelete(task.id); handleMenuClose(); }} disabled={!task.canManage}>
                                <ListItemIcon>
                                  <Delete fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                              </MenuItem>
                            </Menu>
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

      {selectedTaskDetails && (
        <Dialog open={detailsModalOpen} onClose={handleCloseDetailsModal} fullWidth maxWidth="sm">
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>{selectedTaskDetails.title}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Chip icon={<ProjectIcon />} label={`Project: ${selectedTaskDetails.project || '-'}`} />
              </Grid>
              <Grid item xs={6}>
                <Chip icon={<PriorityHigh />} label={`Priority: ${selectedTaskDetails.priority}`} />
              </Grid>
              <Grid item xs={6}>
                <Chip icon={<Schedule />} label={`Estimated Time: ${selectedTaskDetails.estimated_time || 0} Hours`} />
              </Grid>
              <Grid item xs={6}>
                <Chip icon={<HourglassEmpty />} label={`Time Spent: ${selectedTaskDetails.time_spent || '-'}`} />
              </Grid>
              <Grid item xs={6}>
                <Chip icon={<Person />} label={`Assigned By: ${employees.find(e => e.user_id === selectedTaskDetails.assign_by)?.name || '-'}`} />
              </Grid>
              <Grid item xs={6}>
                <Chip icon={<CheckCircle />} label={`Status: ${selectedTaskDetails.status}`} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Description</Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedTaskDetails.description}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailsModal}>Close</Button>
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
