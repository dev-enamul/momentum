import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

const PageLayout = ({ title, children, actions }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#f4f6f8', boxShadow: 'none', py: 0 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ minHeight: '48px !important' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'black' }}>
              {title}
            </Typography>
            {actions}
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
}; 
export default PageLayout;