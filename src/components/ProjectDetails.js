import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../utils/api";
import { Box, Typography, CircularProgress, Paper, Grid, Chip } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, BarElement } from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

import PageLayout from "./layout/PageLayout";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`project/${id}`);
        setProject(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!project) return null;

  const getStatusChip = (status) => {
    let color = "default";
    if (status === "Running") color = "warning";
    if (status === "Completed") color = "success";
    return <Chip label={status} color={color} sx={{ ml: 2 }} />;
  };

  const progressLabels = project.chart_progress.map((p) => p.date);
  const progressData = {
    labels: progressLabels,
    datasets: [
      {
        label: "Expected Hours",
        data: project.chart_progress.map((p) => p.expected_hours),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Actual Hours",
        data: project.chart_progress.map((p) => p.actual_hours),
        borderColor: "rgba(255,99,132,1)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const pieData = {
    labels: ["Completed", "Remaining", "Extra"],
    datasets: [
      {
        data: [
          project.chart_pie.completed_hours,
          project.chart_pie.remaining_hours,
          project.chart_pie.extra_hours,
        ],
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(255,99,132,0.6)",
        ],
      },
    ],
  };

  const last7Labels = project.chart_last7.map((d) => d.date);
  const last7Data = {
    labels: last7Labels,
    datasets: [
      {
        label: "Target Hours",
        data: project.chart_last7.map((d) => d.target_hours),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
      {
        label: "Actual Hours",
        data: project.chart_last7.map((d) => d.actual_hours),
        backgroundColor: "rgba(255,99,132,0.6)",
      },
    ],
  };

  const next7Labels = project.chart_next7.map((d) => d.date);
  const next7Data = {
    labels: next7Labels,
    datasets: [
      {
        label: "Planned Target",
        data: project.chart_next7.map((d) => d.target_hours),
        backgroundColor: "rgba(54,162,235,0.6)",
      },
    ],
  };

  return (
    <PageLayout title={project.project_title}>
      {/* TITLE + CUSTOMER + STATUS */}
      <Typography variant="h4">
        {project.project_title}
        {getStatusChip(project.project_status)}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
        {project.customer_name}
      </Typography>

      {/* FIRST ROW: Progress + Pie */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Progress</Typography>
            <Line data={progressData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Hours Distribution</Typography>
            <Doughnut data={pieData} />
          </Paper>
        </Grid>
      </Grid>

      {/* SECOND ROW: Last 7 Days + Next 7 Days */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Last 7 Days</Typography>
            <Bar data={last7Data} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Next 7 Days (Forecast)</Typography>
            <Bar data={next7Data} />
          </Paper>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default ProjectDetails;
