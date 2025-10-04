import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import Documents from './components/Documents';
import Schedule from './components/Schedule';
import Directory from './components/Directory';
import Login from './components/Login';
import Admin from './components/Admin';
import NewPost from './components/NewPost';
import Committee from './components/Committee';
import InternalDirectory from './components/InternalDirectory';
import HospitalLog from './components/HospitalLog';
import DutyLog from './components/DutyLog';
import type { View, User, Post, ScheduleEvent, DirectoryEntry, HospitalLogEntry, DutyLogEntry } from './types';
import { INITIAL_POSTS, INITIAL_SCHEDULE_EVENTS, INITIAL_DIRECTORY_ENTRIES, INITIAL_HOSPITAL_LOG_ENTRIES, INITIAL_DUTY_LOG_ENTRIES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(INITIAL_SCHEDULE_EVENTS);
  const [directoryEntries, setDirectoryEntries] = useState<DirectoryEntry[]>(INITIAL_DIRECTORY_ENTRIES);
  const [hospitalLogEntries, setHospitalLogEntries] = useState<HospitalLogEntry[]>(INITIAL_HOSPITAL_LOG_ENTRIES);
  const [dutyLogEntries, setDutyLogEntries] = useState<DutyLogEntry[]>(INITIAL_DUTY_LOG_ENTRIES);

  const handleLogin = (username: string) => {
    // This is a mock login. In a real app, you'd verify credentials.
    setIsLoggedIn(true);
    // Switch between user types for testing purposes by changing the object here.
    // Nurse (Limited Access)
    setUser({
        id: 1,
        name: '田中 太郎',
        role: '看護師',
        avatarUrl: 'https://picsum.photos/id/237/100/100'
    });
    // Director (Full Access)
    /*
    setUser({
        id: 100,
        name: '鈴木 一郎',
        role: '看護部長',
        avatarUrl: 'https://picsum.photos/id/1005/100/100'
    });
    */
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('dashboard');
  };

  const addPost = (post: Omit<Post, 'id' | 'date' | 'author'>) => {
    const newPost: Post = {
        ...post,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        author: user?.name || '不明なユーザー',
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setCurrentView('dashboard');
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deletePost = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const addEvent = (event: Omit<ScheduleEvent, 'id' | 'authorId' | 'authorName' | 'date'>, date: string) => {
    if (!user) return;
    const newEvent: ScheduleEvent = {
        ...event,
        id: Date.now(),
        date,
        authorId: user.id,
        authorName: user.name,
    };
    setScheduleEvents(prev => [...prev, newEvent].sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99')));
  };

  const updateEvent = (updatedEvent: ScheduleEvent) => {
      setScheduleEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e).sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99')));
  };

  const deleteEvent = (eventId: number) => {
      setScheduleEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const addDirectoryEntry = (entry: Omit<DirectoryEntry, 'id'>) => {
    const newEntry: DirectoryEntry = {
        ...entry,
        id: Date.now(),
    };
    setDirectoryEntries(prev => [...prev, newEntry].sort((a, b) => a.department.localeCompare(b.department) || a.name.localeCompare(b.name)));
  };

  const updateDirectoryEntry = (updatedEntry: DirectoryEntry) => {
      setDirectoryEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };

  const deleteDirectoryEntry = (entryId: number) => {
      setDirectoryEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const addLogEntry = (entry: Omit<HospitalLogEntry, 'id' | 'authorId' | 'authorName'>) => {
      if(!user) return;
      const newEntry: HospitalLogEntry = {
          ...entry,
          id: Date.now(),
          authorId: user.id,
          authorName: user.name,
      };
      setHospitalLogEntries(prev => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)));
  };

  const updateLogEntry = (updatedEntry: HospitalLogEntry) => {
      setHospitalLogEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };

  const deleteLogEntry = (entryId: number) => {
      setHospitalLogEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const addDutyLogEntry = (entry: Omit<DutyLogEntry, 'id' | 'authorId' | 'authorName'>) => {
      if(!user) return;
      const newEntry: DutyLogEntry = {
          ...entry,
          id: Date.now(),
          authorId: user.id,
          authorName: user.name,
      };
      setDutyLogEntries(prev => [...prev, newEntry].sort((a, b) => a.dutyDate.localeCompare(b.dutyDate) || a.time.localeCompare(b.time)));
  };

  const updateDutyLogEntry = (updatedEntry: DutyLogEntry) => {
      setDutyLogEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };

  const deleteDutyLogEntry = (entryId: number) => {
      setDutyLogEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const renderView = () => {
    // Protected views that require login
    const protectedViews: View[] = ['ai-assistant', 'documents', 'directory', 'admin', 'new-post', 'hospital-log', 'duty-log'];

    if (!isLoggedIn && protectedViews.includes(currentView)) {
        return <Dashboard posts={posts.filter(p => p.isVisible)} setCurrentView={setCurrentView} isLoggedIn={isLoggedIn} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard posts={posts.filter(p => p.isVisible)} setCurrentView={setCurrentView} isLoggedIn={isLoggedIn} />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'documents':
        return <Documents />;
      case 'schedule':
        return <Schedule 
                events={scheduleEvents}
                user={user}
                addEvent={addEvent}
                updateEvent={updateEvent}
                deleteEvent={deleteEvent}
               />;
      case 'directory':
        return <Directory />;
       case 'committee':
        return <Committee isLoggedIn={isLoggedIn} />;
      case 'internal-directory':
        return <InternalDirectory 
                  entries={directoryEntries}
                  isLoggedIn={isLoggedIn}
                  onAdd={addDirectoryEntry}
                  onUpdate={updateDirectoryEntry}
                  onDelete={deleteDirectoryEntry}
                />;
      case 'hospital-log':
          return <HospitalLog 
                    logEntries={hospitalLogEntries}
                    user={user}
                    addLogEntry={addLogEntry}
                    updateLogEntry={updateLogEntry}
                    deleteLogEntry={deleteLogEntry}
                  />;
      case 'duty-log':
          return <DutyLog 
                    logEntries={dutyLogEntries}
                    user={user}
                    addLogEntry={addDutyLogEntry}
                    updateLogEntry={updateDutyLogEntry}
                    deleteLogEntry={deleteDutyLogEntry}
                  />;
      case 'admin':
        return <Admin posts={posts} updatePost={updatePost} deletePost={deletePost} />;
      case 'new-post':
        return <NewPost addPost={addPost} setCurrentView={setCurrentView} />;
      default:
        return <Dashboard posts={posts.filter(p => p.isVisible)} setCurrentView={setCurrentView} isLoggedIn={isLoggedIn}/>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
