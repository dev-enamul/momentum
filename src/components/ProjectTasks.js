import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import PageLayout from './layout/PageLayout';

const ProjectTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`/api/tasks?project_id=${projectId}`);
        setTasks(data.data);
      } catch (error) {
        console.error(`Failed to fetch tasks for project ${projectId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  return (
    <PageLayout title={`Tasks for Project ${projectId}`}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Estimated Time</TableCell>
                <TableCell>Time Spent</TableCell>
                <TableCell>Assign By</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.estimated_time}</TableCell>
                  <TableCell>{task.time_spent}</TableCell>
                  <TableCell>{task.assign_by}</TableCell>
                  <TableCell>{task.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </PageLayout>
  );
};

export default ProjectTasks;
