// src/hooks/useNavbar.js
import { useState, useEffect } from 'react';

export default function useNavbar({ initialTitle = 'Operational Dashboard', initialNotifications = 3 } = {}) {
    const [title, setTitle] = useState(initialTitle);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        // Gentle polling that could refresh notifications in a real app.
        // Notifications are kept stable by default in this demo harness.
        const interval = setInterval(() => {
            // no-op by default
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
