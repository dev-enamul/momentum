import React from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Card, CardContent, CircularProgress, LinearProgress, Chip, TablePagination, TextField 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import PageLayout from './layout/PageLayout';

const Projects = () => {
  const navigate = useNavigate();
  const {
    data: projects,
    loading,
    page,
    rowsPerPage,
    totalItems: totalProjects,
    filters,
    handleFilterChange,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePaginatedFetch('projects', { keyword: '' });

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <PageLayout title="Projects">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Projects List</Typography>
        <TextField
          label="Search by Keyword"
          variant="outlined"
          size="small"
          value={filters.keyword}
          onChange={(e) => handleFilterChange('keyword', e.target.value)}
        />
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date (Start → End)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Leader</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((proj) => {
                const progressPercentage = Math.min(100, Math.round((proj.actual_progress / proj.expected_progress) * 100));
                return (
                  <TableRow 
                    key={proj.project_id} 
                    onClick={() => handleProjectClick(proj.project_id)} 
                    sx={{ 
                      cursor: 'pointer',
                      '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
                    }}
                  >
                    <TableCell>{proj.title || 'Untitled Project'}</TableCell>
                    <TableCell>{proj.customer_name}</TableCell>
                    <TableCell>{proj.project_status}</TableCell>
                    <TableCell>{`${proj.created_at} → ${proj.submit_date}`}</TableCell>
                    <TableCell>
                      {proj.is_leader ? <Chip label="Leader" color="primary" size="small"/> : <Chip label="Member" size="small" />}
                    </TableCell>
                    <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(100, Math.round((proj.actual_progress / proj.expected_progress) * 100))} 
                          sx={{ flexGrow: 1, height: 10, borderRadius: 5 }} 
                        />
                        <Typography variant="body2" sx={{ minWidth: 35 }}>
                          {Math.min(100, Math.round((proj.actual_progress / proj.expected_progress) * 100))}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {`${proj.completed_hours} / ${proj.estimated_hour} hrs`}
                      </Typography>
                    </Box>
                  </TableCell> 
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25]}
        component="div"
        count={totalProjects}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </PageLayout>
  );
};

export default Projects;
