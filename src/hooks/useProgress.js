import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

// Main progress hook - fetches all progress data
export function useProgress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/progress`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch progress');
      
      const data = await response.json();
      setProgress(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [fetchProgress]);

  return { progress, loading, error, refetch: fetchProgress };
}

// Reading progress hook
export function useReadingProgress() {
  const [completedPassageIds, setCompletedPassageIds] = useState([]);
  const [completedTestIds, setCompletedTestIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/reading/progress`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setCompletedPassageIds(data.completedPassageIds || []);
        setCompletedTestIds(data.completedTestIds || []);
      }
    } catch (err) {
      console.error('Error fetching reading progress:', err);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markPassageComplete = useCallback(async (passageId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/reading/progress/passage`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ passageId: String(passageId) })
      });
      if (response.ok) {
        setCompletedPassageIds(prev => [...prev, String(passageId)]);
      }
    } catch (err) {
      console.error('Error marking passage complete:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markTestComplete = useCallback(async (testId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/reading/progress/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ testId: String(testId) })
      });
      if (response.ok) {
        setCompletedTestIds(prev => [...prev, String(testId)]);
      }
    } catch (err) {
      console.error('Error marking test complete:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const isPassageCompleted = useCallback((passageId) => {
    return completedPassageIds.includes(String(passageId));
  }, [completedPassageIds]);

  const isTestCompleted = useCallback((testId) => {
    return completedTestIds.includes(String(testId));
  }, [completedTestIds]);

  return {
    completedPassageIds,
    completedTestIds,
    markPassageComplete,
    markTestComplete,
    isPassageCompleted,
    isTestCompleted,
    loading,
    refetch: fetchProgress
  };
}

// Listening progress hook
export function useListeningProgress() {
  const [completedSectionIds, setCompletedSectionIds] = useState([]);
  const [completedTestIds, setCompletedTestIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/listening/progress`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setCompletedSectionIds(data.completedSectionIds || []);
        setCompletedTestIds(data.completedTestIds || []);
      }
    } catch (err) {
      console.error('Error fetching listening progress:', err);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markSectionComplete = useCallback(async (sectionId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/listening/progress/section`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ sectionId: String(sectionId) })
      });
      if (response.ok) {
        setCompletedSectionIds(prev => [...prev, String(sectionId)]);
      }
    } catch (err) {
      console.error('Error marking section complete:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markTestComplete = useCallback(async (testId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/listening/progress/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ testId: String(testId) })
      });
      if (response.ok) {
        setCompletedTestIds(prev => [...prev, String(testId)]);
      }
    } catch (err) {
      console.error('Error marking test complete:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const isSectionCompleted = useCallback((sectionId) => {
    return completedSectionIds.includes(String(sectionId));
  }, [completedSectionIds]);

  const isTestCompleted = useCallback((testId) => {
    return completedTestIds.includes(String(testId));
  }, [completedTestIds]);

  return {
    completedSectionIds,
    completedTestIds,
    markSectionComplete,
    markTestComplete,
    isSectionCompleted,
    isTestCompleted,
    loading,
    refetch: fetchProgress
  };
}

// Speaking progress hook
export function useSpeakingProgress() {
  const [completedPart1Ids, setCompletedPart1Ids] = useState([]);
  const [completedPart2Ids, setCompletedPart2Ids] = useState([]);
  const [completedPart3Ids, setCompletedPart3Ids] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/speaking/progress`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setCompletedPart1Ids(data.completedPart1Ids || []);
        setCompletedPart2Ids(data.completedPart2Ids || []);
        setCompletedPart3Ids(data.completedPart3Ids || []);
      }
    } catch (err) {
      console.error('Error fetching speaking progress:', err);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markQuestionComplete = useCallback(async (questionId, part) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/speaking/progress`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ questionId: String(questionId), part: `part${part}` })
      });
      if (response.ok) {
        if (part === 1) setCompletedPart1Ids(prev => [...prev, String(questionId)]);
        if (part === 2) setCompletedPart2Ids(prev => [...prev, String(questionId)]);
        if (part === 3) setCompletedPart3Ids(prev => [...prev, String(questionId)]);
      }
    } catch (err) {
      console.error('Error marking question complete:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const isQuestionCompleted = useCallback((questionId, part) => {
    const id = String(questionId);
    if (part === 1) return completedPart1Ids.includes(id);
    if (part === 2) return completedPart2Ids.includes(id);
    if (part === 3) return completedPart3Ids.includes(id);
    return false;
  }, [completedPart1Ids, completedPart2Ids, completedPart3Ids]);

  return {
    completedPart1Ids,
    completedPart2Ids,
    completedPart3Ids,
    markQuestionComplete,
    isQuestionCompleted,
    loading,
    refetch: fetchProgress
  };
}

// Writing progress hook
export function useWritingProgress() {
  const [completedTask1Ids, setCompletedTask1Ids] = useState([]);
  const [completedTask2Ids, setCompletedTask2Ids] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/writing/progress`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setCompletedTask1Ids(data.completedTask1Ids || []);
        setCompletedTask2Ids(data.completedTask2Ids || []);
      }
    } catch (err) {
      console.error('Error fetching writing progress:', err);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markTaskComplete = useCallback(async (promptId, task) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/writing/progress`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ promptId: String(promptId), task })
      });
      if (response.ok) {
        if (task === 'task1') setCompletedTask1Ids(prev => [...prev, String(promptId)]);
        if (task === 'task2') setCompletedTask2Ids(prev => [...prev, String(promptId)]);
      }
    } catch (err) {
      console.error('Error marking task complete:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const isTaskCompleted = useCallback((promptId, task) => {
    const id = String(promptId);
    if (task === 'task1') return completedTask1Ids.includes(id);
    if (task === 'task2') return completedTask2Ids.includes(id);
    return false;
  }, [completedTask1Ids, completedTask2Ids]);

  return {
    completedTask1Ids,
    completedTask2Ids,
    markTaskComplete,
    isTaskCompleted,
    loading,
    refetch: fetchProgress
  };
}
