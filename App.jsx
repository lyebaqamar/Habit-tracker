import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  // LocalStorage se habits ka data load karna
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('advanced_habits');
    return saved ? JSON.parse(saved) : [];
  });

  // Track the currently viewed week's starting date (Monday)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get current Monday
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [newHabitName, setNewHabitName] = useState('');

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('advanced_habits', JSON.stringify(habits));
  }, [habits]);

  // Helper: Generate the 7 date strings (YYYY-MM-DD) for the current week view
  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const todayStr = new Date().toISOString().split('T')[0];

  // Week Navigation Handlers
  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const handleResetWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  // Add Habit
  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: Date.now().toString(),
      name: newHabitName,
      history: {} // Format: { "2026-05-25": true }
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  // Delete Habit
  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  // Toggle Day Checkbox
  const toggleDay = (habitId, dateStr) => {
    // Prevent checking future dates
    if (dateStr > todayStr) return;

    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          history: {
            ...habit.history,
            [dateStr]: !habit.history[dateStr]
          }
        };
      }
      return habit;
    }));
  };

  // Calculate real consecutive day streak ending today or yesterday
  const calculateCurrentStreak = (history) => {
    let streak = 0;
    let checkDate = new Date(); 
    
    const todayFormatted = checkDate.toISOString().split('T')[0];
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];

    if (!history[todayFormatted] && !history[yesterdayFormatted]) {
      return 0;
    }

    if (!history[todayFormatted] && history[yesterdayFormatted]) {
      checkDate = yesterday;
    }

    while (true) {
      const formatted = checkDate.toISOString().split('T')[0];
      if (history[formatted]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1); 
      } else {
        break;
      }
    }
    return streak;
  };

  // UI Date Formatter (e.g., "Mon 25")
  const formatDayLabel = (dateStr) => {
    const dateObj = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[dateObj.getDay()]} ${dateObj.getDate()}`;
  };

  return (
    <div className="app-container">
      <h1>My Weekly Habit Tracker</h1>

      {/* Week Navigation Controls */}
      <div className="navigation-controls">
        <button onClick={handlePrevWeek} className="nav-btn">◀ Last Week</button>
        <button onClick={handleResetWeek} className="nav-btn secondary">This Week</button>
        <button onClick={handleNextWeek} className="nav-btn">Next Week ▶</button>
      </div>

      {/* Input Form */}
      <form onSubmit={addHabit} className="habit-form">
        <input 
          type="text" 
          placeholder="What habit are you building? (e.g. Coding 2 hours)" 
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <button type="submit">Add Habit</button>
      </form>

      {/* Grid view / Empty State */}
      {habits.length === 0 ? (
        <div className="empty-state">
          <h3>Your tracker is ready!</h3>
          <p>Type a routine target above to generate your tracking grid matrix. 🚀</p>
        </div>
      ) : (
        <div className="grid-wrapper">
          <table className="habit-table">
            <thead>
              <tr>
                <th>Habit Focus</th>
                {weekDates.map(date => (
                  <th key={date} className={date === todayStr ? 'today-header' : ''}>
                    {formatDayLabel(date)}
                    {date === todayStr && <span className="today-badge">TODAY</span>}
                  </th>
                ))}
                <th>Current Streak</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => (
                <tr key={habit.id}>
                  <td className="habit-name">{habit.name}</td>
                  {weekDates.map(date => {
                    const isFuture = date > todayStr;
                    return (
                      <td 
                        key={date} 
                        className={`text-center ${date === todayStr ? 'today-cell' : ''} ${isFuture ? 'future-cell' : ''}`}
                      >
                        <input 
                          type="checkbox" 
                          checked={!!habit.history[date]} 
                          disabled={isFuture}
                          onChange={() => toggleDay(habit.id, date)}
                        />
                      </td>
                    );
                  })}
                  <td className="streak-count">
                    <span>🔥 {calculateCurrentStreak(habit.history)} days</span>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}