import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, LinearProgress, Chip
} from '@mui/material';
import { SystemUpdateAlt, CheckCircle } from '@mui/icons-material';

const UpdateModal = () => {
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState('');
  const [progress, setProgress] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onUpdateAvailable((v) => {
      setVersion(v);
      setOpen(true);
    });

    window.electronAPI.onUpdateProgress((percent) => {
      setProgress(percent);
    });

    window.electronAPI.onUpdateDownloaded(() => {
      setDownloaded(true);
      setProgress(100);
    });
  }, []);

  const handleInstall = () => {
    window.electronAPI.installUpdate();
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <SystemUpdateAlt sx={{ color: '#92288E' }} />
        <Typography fontWeight={700}>Update Available</Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">New version:</Typography>
          <Chip label={`v${version}`} size="small" sx={{ bgcolor: '#f3e5f5', color: '#92288E', fontWeight: 700 }} />
        </Box>

        {progress === null && !downloaded && (
          <Typography variant="body2" color="text.secondary">
            A new version is ready to download. Update now to get the latest features and fixes.
          </Typography>
        )}

        {progress !== null && !downloaded && (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Downloading... {progress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ borderRadius: 2, height: 6, '& .MuiLinearProgress-bar': { bgcolor: '#92288E' } }}
            />
          </Box>
        )}

        {downloaded && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
            <Typography variant="body2" color="success.main" fontWeight={600}>
              Download complete! Ready to install.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {!downloaded && progress === null && (
          <>
            <Button onClick={() => setOpen(false)} size="small" sx={{ color: '#999', textTransform: 'none' }}>
              Later
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setProgress(0)}
              sx={{ bgcolor: '#92288E', textTransform: 'none', '&:hover': { bgcolor: '#7a2078' } }}
            >
              Download Update
            </Button>
          </>
        )}
        {downloaded && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleInstall}
            sx={{ bgcolor: '#92288E', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#7a2078' } }}
          >
            Install & Restart
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UpdateModal;
