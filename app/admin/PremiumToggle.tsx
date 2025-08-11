import { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Paper } from '@mui/material';
import { getTogglePremium, updateTogglePremium } from '@/utils/api';
import { toast } from 'sonner';

const PremiumToggle = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fetch current state from Django API
    getTogglePremium().then((is_visible) => {
      setIsVisible(is_visible);
    }).catch((error) => {
        toast.error("Failed to fetch premium toggle state")
        console.error("Error fetching premium toggle state:", error);
    }
    );
  }, []);

  const handleToggle = async (event: { target: { checked: any; }; }) => {
    const newState = event.target.checked;
    setIsVisible(newState);

    updateTogglePremium(newState);
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 400, margin: 'auto' }}>
      <FormControlLabel
        control={<Switch checked={isVisible} onChange={handleToggle} color="primary" />}
        label="Show Premium Component"
      />
    </Paper>
  );
};

export default PremiumToggle;
