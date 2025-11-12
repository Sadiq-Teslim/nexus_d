// src/hooks/useNavbar.js
import { useState, useEffect } from 'react';

export default function useNavbar({ initialTitle = 'Operational Dashboard', initialNotifications = 3 } = {}) {
    const [title, setTitle] = useState(initialTitle);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        // Mock: gentle polling that could refresh notifications in a real app
        const interval = setInterval(() => {
            // keep notifications stable in this mock by default
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const toggleNotif = () => setIsNotifOpen(v => !v);
    const toggleSettings = () => setIsSettingsOpen(v => !v);
    const clearNotifications = () => setNotifications(0);
    const pushNotification = (count = 1) => setNotifications(n => n + count);

    return {
        title,
        setTitle,
        notifications,
        setNotifications,
        isNotifOpen,
        isSettingsOpen,
        toggleNotif,
        toggleSettings,
        clearNotifications,
        pushNotification
    };
}
