
const apiFetch = async (endpoint, { method = 'GET', body } = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const baseUrl = 'https://crm.zoomdigital.net/api/';
  const response = await fetch(`${baseUrl}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'API request failed');
  }

  const result = await response.json();
  if (result.success) {
    return result;
  } else {
    throw new Error(result.message || 'API request returned an error');
  }
};

export const completeTask = (task_ids) => {
    return apiFetch('completed-task', {
        method: 'POST',
        body: { task_ids },
    });
};

export const assignTask = (task_ids, employee_id) => {
    return apiFetch('assign-task', {
        method: 'POST',
        body: { task_ids, employee_id },
    });
};

export default apiFetch;
