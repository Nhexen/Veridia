import React, { useState } from "react";
import { Container, TextField, Button, Box, Typography, Paper } from "@mui/material";

function App() {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult("");
        try {
            const response = await fetch("http://localhost:8000/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await response.json();
            setResult(data.choices?.[0]?.message?.content || JSON.stringify(data));
        } catch (err) {
            setResult("Erreur lors de la génération.");
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 6 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Client AI (LM Studio)
                </Typography>
                <Box component="form" onSubmit={handleSubmit} mb={2}>
                    <TextField
                        label="Votre prompt"
                        fullWidth
                        multiline
                        minRows={3}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2 }}
                        disabled={loading || !prompt.trim()}
                    >
                        {loading ? "Génération..." : "Générer"}
                    </Button>
                </Box>
                {result && (
                    <Box mt={3}>
                        <Typography variant="h6">Résultat :</Typography>
                        <Paper sx={{ p: 2, mt: 1, background: "#f5f5f5" }}>
                            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{result}</pre>
                        </Paper>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default App;
