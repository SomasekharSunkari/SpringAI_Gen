
import { Button, CircularProgress, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import axios from "axios";
import { FormControl } from '@mui/material';

import './App.css'
import { useState } from 'react';
function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handelSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      console.log(tone)
      const reponse = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/email/generate", {
        emailContent, tone

      })
      setGeneratedEmail(typeof reponse.data === "string" ? reponse.data : JSON.stringify(reponse.data))
      console.log(import.meta.env.VITE_BACKEND_URL)
    }
    catch (err) {
      setError("Failed to genreate replay at this time please try again !");
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <main className='max-w-[1500px]  mx-auto'>
      <Typography variant='h1' component={"h2"} className='font-bold text-center'>Automatic Email Generator</Typography>
      <Box sx={{ mx: 3, p: 2 }} >
        <TextField fullWidth multiline rows={6} variant="outlined" label="Enter Your Email Content" value={emailContent || ""} sx={{ mb: 2 }} onChange={(e) => setEmailContent(e.target.value)} />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel htmlFor="tone">Tone(Optional)</InputLabel>
          <Select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            label="Tone (Optional)">
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="professionally">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>
        <Button type="button" variant="contained" onClick={handelSubmit} disabled={!emailContent || loading}>
          {loading ? <CircularProgress /> : "Generated Replay !"}
        </Button>
      </Box>

      {error && <Typography gutterBottom color="error" sx={{ mb: 2 }}>
        {error}
      </Typography>}
      {generatedEmail &&
        <Box sx={{ mt: 6 }}>
          <Typography gutterBottom variant="h6" color="info" sx={{ mb: 2 }}>
            Generated Reply:
          </Typography>
          <TextField fullWidth multiline rows={6} variant="outlined" value={generatedEmail || ""} />
          <Button variant="outlined" onClick={() => navigator.clipboard.writeText(generatedEmail)} sx={{ mt: 2 }}>

            Copy to Clipboard
          </Button>
        </Box>
      }
    </main >
  )
}

export default App
