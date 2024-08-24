import React, { useState } from 'react';
import styles from './Home.module.css'; // Import the CSS module
import { useNavigate } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import AddTransaction from '../Transaction/AddTransaction';

const Home = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.sidebar}>
                <div  className={styles.tabsContainer}>
                <h2>Finance Tracker</h2>
                    <span
                        className={`${styles.tab} ${activeTab === 'dashboard' ? styles.active : ''}`}
                        onClick={() => handleTabChange('dashboard')}
                    >
                        Dashboard
                    </span>
                    <span
                        className={`${styles.tab} ${activeTab === 'addTransaction' ? styles.active : ''}`}
                        onClick={() => handleTabChange('addTransaction')}
                    >
                        Add Transaction
                    </span>
                </div>
                <div className={styles.userSection}>
                    <span className={styles.username}>John Doe</span>
                    <span
                        className={styles.logout}
                        onClick={handleLogout}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="25px">
                            <path fill='red' d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                        </svg>
                    </span>
                </div>
            </div>
            <div className={styles.content}>
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'addTransaction' && <AddTransaction />}
            </div>
        </div>

    );
};

export default Home;
