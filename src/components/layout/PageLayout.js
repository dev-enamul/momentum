import React, { useEffect } from 'react';
import { Container, Box } from '@mui/material';
import AnimatedBackground from './AnimatedBackground';
import BottomNavbar from './BottomNavbar';

const PageLayout = ({ children, setLoggedIn, loggedIn }) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      document.body.style.setProperty('--scrollTop', `${scrollTop}px`);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AnimatedBackground />
      {loggedIn && <BottomNavbar setLoggedIn={setLoggedIn} />}
      <Box component="main" sx={{ flexGrow: 1, p: loggedIn ? 3 : 0, overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageLayout;