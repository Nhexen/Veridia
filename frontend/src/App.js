import React, { useState, useEffect, useRef } from "react";
import {
    Box, TextField, IconButton, Typography, Paper, Avatar,
    Fade, Grow, AppBar, Toolbar, Chip, Tooltip
} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBrain, faUser, faRobot, faPaperPlane, faCopy, faTrash,
    faMemory, faClock, faCode
} from '@fortawesome/free-solid-svg-icons';

function App() {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({
        totalRequests: 0,
        totalTokens: 0,
        avgResponseTime: 0
    });
    const messagesEndRef = useRef(null);

    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Charger l'historique depuis localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem('veridia-chat-history');
        const savedStats = localStorage.getItem('veridia-stats');

        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    }, []);

    // Sauvegarder les données
    const saveToStorage = (newMessages, newStats) => {
        localStorage.setItem('veridia-chat-history', JSON.stringify(newMessages));
        localStorage.setItem('veridia-stats', JSON.stringify(newStats));
    };

    const handleSendMessage = async () => {
        if (!currentMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: currentMessage,
            timestamp: new Date()
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setCurrentMessage("");
        setIsLoading(true);

        const startTime = performance.now();

        try {
            const response = await fetch("http://localhost:8000/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: currentMessage }),
            });

            const data = await response.json();
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);

            const assistantMessage = {
                id: Date.now() + 1,
                type: 'assistant',
                content: data.choices?.[0]?.message?.content || data.error || "Erreur lors de la génération",
                timestamp: new Date(),
                responseTime,
                tokens: data.usage?.total_tokens || 0,
                success: !!data.choices?.[0]?.message?.content
            };

            const updatedMessages = [...newMessages, assistantMessage];
            setMessages(updatedMessages);

            // Mettre à jour les statistiques
            const newStats = {
                totalRequests: stats.totalRequests + 1,
                totalTokens: stats.totalTokens + (assistantMessage.tokens || 0),
                avgResponseTime: Math.round(
                    (stats.avgResponseTime * stats.totalRequests + responseTime) / (stats.totalRequests + 1)
                )
            };
            setStats(newStats);

            saveToStorage(updatedMessages, newStats);

        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'assistant',
                content: "Erreur de connexion avec le serveur. Vérifiez que LM Studio est démarré.",
                timestamp: new Date(),
                success: false,
                isError: true
            };

            const updatedMessages = [...newMessages, errorMessage];
            setMessages(updatedMessages);
            saveToStorage(updatedMessages, stats);
        }

        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const clearChat = () => {
        setMessages([]);
        setStats({ totalRequests: 0, totalTokens: 0, avgResponseTime: 0 });
        localStorage.removeItem('veridia-chat-history');
        localStorage.removeItem('veridia-stats');
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box
            sx={{
                height: '100vh',
                background: 'linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header avec style Apple */}
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    color: '#1d1d1f'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}
                        >
                            <FontAwesomeIcon icon={faBrain} size="lg" />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: '#1d1d1f',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                            }}
                        >
                            Veridia
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                            icon={<FontAwesomeIcon icon={faMemory} />}
                            label={`${stats.totalTokens.toLocaleString()} tokens`}
                            size="small"
                            sx={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: '#1d1d1f',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        />
                        <Chip
                            icon={<FontAwesomeIcon icon={faClock} />}
                            label={`${stats.avgResponseTime}ms`}
                            size="small"
                            sx={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: '#1d1d1f',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        />
                        <Tooltip title="Vider la conversation">
                            <IconButton
                                onClick={clearChat}
                                size="small"
                                sx={{
                                    color: '#1d1d1f',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.2)'
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Zone de chat */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%',
                    px: 2
                }}
            >
                {/* Messages */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        py: 2,
                        px: 1,
                        '&::-webkit-scrollbar': {
                            width: '6px'
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '3px'
                        }
                    }}
                >
                    {messages.length === 0 && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                textAlign: 'center',
                                opacity: 0.6
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faCode}
                                size="3x"
                                style={{ marginBottom: '16px', color: '#8e8e93' }}
                            />
                            <Typography variant="h6" sx={{ color: '#8e8e93', mb: 1 }}>
                                Bienvenue sur Veridia
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#8e8e93' }}>
                                Votre assistant IA personnel pour le développement
                            </Typography>
                        </Box>
                    )}

                    {messages.map((message) => (
                        <Fade in={true} key={message.id} timeout={300}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    mb: 3,
                                    flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                                }}
                            >
                                <Avatar
                                    sx={{
                                        mx: 1,
                                        width: 36,
                                        height: 36,
                                        background: message.type === 'user'
                                            ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)'
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={message.type === 'user' ? faUser : faRobot}
                                        size="sm"
                                    />
                                </Avatar>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        maxWidth: '70%',
                                        px: 2,
                                        py: 1.5,
                                        background: message.type === 'user'
                                            ? '#007AFF'
                                            : message.isError
                                                ? '#FF3B30'
                                                : 'rgba(255, 255, 255, 0.9)',
                                        color: message.type === 'user' || message.isError ? 'white' : '#1d1d1f',
                                        borderRadius: message.type === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                        backdropFilter: 'blur(10px)',
                                        border: message.type === 'assistant' && !message.isError
                                            ? '1px solid rgba(0, 0, 0, 0.1)'
                                            : 'none',
                                        position: 'relative'
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: message.type === 'assistant'
                                                ? "'SF Mono', 'Monaco', 'Consolas', monospace"
                                                : 'inherit',
                                            whiteSpace: 'pre-wrap',
                                            fontSize: '14px',
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {message.content}
                                    </Typography>

                                    {message.type === 'assistant' && !message.isError && (
                                        <Tooltip title="Copier le code">
                                            <IconButton
                                                size="small"
                                                onClick={() => copyToClipboard(message.content)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    opacity: 0.7,
                                                    '&:hover': { opacity: 1 }
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faCopy} size="xs" />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            mt: 0.5,
                                            opacity: 0.7,
                                            fontSize: '11px'
                                        }}
                                    >
                                        {formatTime(message.timestamp)}
                                        {message.responseTime && ` • ${message.responseTime}ms`}
                                        {message.tokens && ` • ${message.tokens} tokens`}
                                    </Typography>
                                </Paper>
                            </Box>
                        </Fade>
                    ))}

                    {isLoading && (
                        <Grow in={true}>
                            <Box sx={{ display: 'flex', mb: 3 }}>
                                <Avatar
                                    sx={{
                                        mx: 1,
                                        width: 36,
                                        height: 36,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faRobot} size="sm" />
                                </Avatar>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '20px 20px 20px 4px',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {[0, 1, 2].map((i) => (
                                                <Box
                                                    key={i}
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        background: '#8e8e93',
                                                        animation: 'pulse 1.4s ease-in-out infinite',
                                                        animationDelay: `${i * 0.2}s`,
                                                        '@keyframes pulse': {
                                                            '0%, 80%, 100%': { opacity: 0.3 },
                                                            '40%': { opacity: 1 }
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#8e8e93' }}>
                                            Veridia réfléchit...
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Grow>
                    )}

                    <div ref={messagesEndRef} />
                </Box>

                {/* Zone de saisie */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 2,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '25px',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', p: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            placeholder="Tapez votre message..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: {
                                    px: 2,
                                    py: 1,
                                    fontSize: '16px',
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                }
                            }}
                        />                        <IconButton
                            onClick={handleSendMessage}
                            disabled={!currentMessage.trim() || isLoading}
                            sx={{
                                mx: 1,
                                background: currentMessage.trim() && !isLoading
                                    ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)'
                                    : '#e5e5ea',
                                color: currentMessage.trim() && !isLoading ? 'white' : '#8e8e93',
                                '&:hover': {
                                    background: currentMessage.trim() && !isLoading
                                        ? 'linear-gradient(135deg, #0056b3 0%, #4a47a3 100%)'
                                        : '#e5e5ea',
                                    color: currentMessage.trim() && !isLoading ? 'white' : '#007AFF'
                                },
                                '&:active': {
                                    transform: 'scale(0.95)',
                                    background: currentMessage.trim() && !isLoading
                                        ? 'linear-gradient(135deg, #0051D0 0%, #3B3892 100%)'
                                        : '#e5e5ea'
                                },
                                transition: 'all 0.2s ease',
                                '& .fa-paper-plane': {
                                    transition: 'color 0.2s ease'
                                }
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faPaperPlane}
                                className="fa-paper-plane"
                                style={{
                                    transition: 'color 0.2s ease'
                                }}
                            />
                        </IconButton>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default App;
