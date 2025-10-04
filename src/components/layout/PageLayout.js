import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

const PageLayout = ({ title, children, actions }) => {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#92288E', boxShadow: 'none' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ minHeight: '48px !important' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white' }}>
              {title}
            </Typography>
            {actions}
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
};

export default PageLayout;