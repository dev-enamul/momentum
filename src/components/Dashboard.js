import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Backdrop
} from '@mui/material';
import apiFetch, { completeTask } from '../utils/api';
import StartWorkPanel from './dashboard/StartWorkPanel';
import TodayActivityPanel from './dashboard/TodayActivityPanel';
import UrgentTasksPanel from './dashboard/UrgentTasksPanel';
import ProjectSummaryPanel from './dashboard/ProjectSummaryPanel';
import WorkSummaryPanel from './dashboard/WorkSummaryPanel';

import PageLayout from './layout/PageLayout';

const Dashboard = ({ isWorking, setIsWorking }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startWorkLoading, setStartWorkLoading] = useState(false);
  const [endWorkLoading, setEndWorkLoading] = useState(false);
  const [todayActivity, setTodayActivity] = useState([]);
  const [totalHours, setTotalHours] = useState('0:0');
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [cardData, setCardData] = useState({});
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-08-30');
  const [workSummary, setWorkSummary] = useState([]);
  const [apiToken, setApiToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnHold, setIsOnHold] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [heldProjectId, setHeldProjectId] = useState(null);
  const [heldTaskId, setHeldTaskId] = useState(null);
  const [heldNote, setHeldNote] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setApiToken(token);
      if (window.electronAPI) {
        window.electronAPI.sendToken(token);
      }
    }

    const storedStartTime = localStorage.getItem('workStartTime');
    if (storedStartTime) {
      setStartTime(parseInt(storedStartTime, 10));
      setIsWorking(true);
      if (window.electronAPI) {
        window.electronAPI.resumeWork();
      }
    }
  }, []);

  const fetchTodayActivity = async () => {
    try {
      const response = await apiFetch('today-activity');
      setTodayActivity(Array.isArray(response.data) ? response.data : []);
      setTotalHours(response.total_hours || '0:0');
    } catch (err) {
      setError('Failed to fetch today activity');
      console.error(err);
    }
  };

  const fetchUrgentTasks = async () => {
    try {
      const response = await apiFetch('urgent-tasks');
      setUrgentTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch urgent tasks');
      console.error(err);
    }
  };

  const fetchCardData = async () => {
    try {
      const response = await apiFetch('card-data', {
        method: 'GET',
        params: { start_date: startDate, end_date: endDate },
      });
      setCardData(response.data || {});
    } catch (err) {
      setError('Failed to fetch card data');
      console.error(err);
    }
  };

  const fetchWorkSummary = async (start, end) => {
    try {
      const response = await apiFetch('work-summary', {
        method: 'GET',
        params: { start_date: start, end_date: end },
      });
      setWorkSummary(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch work summary');
      console.error(err);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTodayActivity(),
        fetchUrgentTasks(),
        fetchCardData(),
        fetchWorkSummary(startDate, endDate)
      ]);
      setLoading(false);
    }
    loadAllData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCardData(),
        fetchWorkSummary(startDate, endDate)
      ]);
      setLoading(false);
    }
    loadData();
  }, [startDate, endDate]);

  useEffect(() => {
    let interval;
    if (isWorking && !isOnHold && startTime) {
      interval = setInterval(() => {
        setElapsedTime(pausedTime + Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isWorking, isOnHold, startTime, pausedTime]);

  useEffect(() => {
    // When isWorking becomes false, it means work has stopped.
    // We should refresh the activity log and clean up.
    if (!isWorking) {
      fetchTodayActivity();
      localStorage.removeItem('workStartTime');
      if (window.electronAPI) {
        window.electronAPI.stopIdleTimer();
      }
    }
  }, [isWorking]);



  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiFetch('projects?select_field=true');
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to fetch projects');
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const endpoint = projectId 
            ? `tasks?project_filter=${projectId}&select_field=true` 
            : 'tasks?select_field=true'; 
        const response = await apiFetch(endpoint);
        setTasks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to fetch tasks');
      }
    };
    fetchTasks();
  }, [projectId]);

  const handleStartWork = async (taskIdToUse = taskId, projectToUse = projectId, noteToUse = note, isContinuing = false) => {
    setStartWorkLoading(true);
    try {
      const payload = { project_id: projectToUse || null, task_id: taskIdToUse || null, note: noteToUse || '' };
      await window.electronAPI.startWork(payload);
      setSuccess('Work started successfully');
      setError(null);
      // Do NOT reset note and taskId here if continuing
      // setNote('');
      // setTaskId('');
      setIsWorking(true);
      const now = Date.now();
      // If continuing, adjust startTime based on pausedTime
      const newStartTime = isContinuing ? now - (pausedTime * 1000) : now;
      setStartTime(newStartTime);
      localStorage.setItem('workStartTime', newStartTime); // Store the adjusted start time
      if (window.electronAPI) {
        window.electronAPI.startIdleTimer();
      }
    } catch (err) {
      setError('Failed to start work');
      setSuccess(null);
    } finally {
      setStartWorkLoading(false);
      fetchTodayActivity();
    }
  };

  const handleEndWork = async (noteContent, isTemporaryPause = false) => {
    setEndWorkLoading(true);
    try {
      await window.electronAPI.endWork({ note: noteContent || '' });
      setSuccess('Work ended successfully');
      setError(null);
      if (!isTemporaryPause) { // Only set to false if it's a full stop
        setIsWorking(false);
        setElapsedTime(0);
        localStorage.removeItem('workStartTime');
        if (window.electronAPI) {
          window.electronAPI.stopIdleTimer();
        }
      }
    } catch (err) {
      setError('Failed to end work');
      setSuccess(null);
    } finally {
      setEndWorkLoading(false);
      fetchTodayActivity();
    }
  };

  const handleHoldWork = async () => {
    await handleEndWork(note, true); // Pass true for temporary pause
    setIsOnHold(true);
    setPausedTime(elapsedTime);
    setHeldProjectId(projectId); // Save current project
    setHeldTaskId(taskId);       // Save current task
    setHeldNote(note);           // Save current note
  };

  const handleContinueWork = async () => {
    // Use the held values to restart work, and indicate it's a continuation
    await handleStartWork(heldTaskId, heldProjectId, heldNote, true); // Pass true for isContinuing
    setIsOnHold(false);
    // Clear held state after continuing
    setHeldProjectId(null);
    setHeldTaskId(null);
    setHeldNote('');
    setPausedTime(0); // Reset pausedTime after continuing
  };

  const handleCompleteUrgentTask = async (taskId) => {
    if (window.confirm(`Are you sure you want to complete this urgent task?`)) {
      try {
        await completeTask([taskId]);
        setSuccess('Urgent task completed successfully');
        setError(null);
        fetchUrgentTasks(); // Refresh urgent tasks list
        fetchTodayActivity(); // Refresh today's activity as well
      } catch (error) {
        console.error('Failed to complete urgent task:', error);
        setError(`Error completing task: ${error.message}`);
        setSuccess(null);
      }
    }
  };

  return (
    <PageLayout title="Dashboard">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, height: '450px' }}>
        <StartWorkPanel
          isWorkStarted={isWorking}
          elapsedTime={elapsedTime}
          error={error}
          success={success}
          note={note}
          setNote={setNote}
          endWorkLoading={endWorkLoading}
          handleEndWork={handleEndWork}
          projects={projects}
          projectId={projectId}
          setProjectId={setProjectId}
          tasks={tasks}
          taskId={taskId}
          setTaskId={setTaskId}
          startWorkLoading={startWorkLoading}
          handleStartWork={handleStartWork}
          isOnHold={isOnHold}
          handleHoldWork={handleHoldWork}
          handleContinueWork={handleContinueWork}
        />
        <TodayActivityPanel todayActivity={todayActivity} totalHours={totalHours} />
      </Box>

      <UrgentTasksPanel
        urgentTasks={urgentTasks}
        isWorkStarted={isWorking}
        startWorkLoading={startWorkLoading}
        setTaskId={setTaskId}
        handleStartWork={handleStartWork}
        onCompleteTask={handleCompleteUrgentTask}
      />

      <ProjectSummaryPanel
        cardData={cardData}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <WorkSummaryPanel workSummary={workSummary} />
    </PageLayout>
  );
};

export default Dashboard;
