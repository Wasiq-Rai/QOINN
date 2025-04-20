import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { SketchPicker } from 'react-color';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface AddFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (key: string, value: string) => void;
  type: 'strings' | 'colors' | 'images';
}

const AddFieldDialog = ({ open, onClose, onAdd, type }: AddFieldDialogProps) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState(type === 'colors' ? '#000000' : '');

  const handleSubmit = () => {
    if (key && value) {
      onAdd(key, value);
      setKey('');
      setValue(type === 'colors' ? '#000000' : '');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New {type.charAt(0).toUpperCase() + type.slice(1, -1)}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Key"
          fullWidth
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        {type === 'colors' ? (
          <Box mt={2}>
            <SketchPicker
              color={value}
              onChange={(color) => setValue(color.hex)}
            />
          </Box>
        ) : (
          <TextField
            margin="dense"
            label="Value"
            fullWidth
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const ThemeEditor = () => {
  const { theme, updateTheme, isLoading } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [editedTheme, setEditedTheme] = useState(theme);
  const [selectedColor, setSelectedColor] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    setEditedTheme(theme);
  }, [theme]);

  const handleStringChange = (key: string, value: string) => {
    setEditedTheme(prev => ({
      ...prev,
      strings: { ...prev.strings, [key]: value },
    }));
    setUnsavedChanges(true);
  };

  const handleColorChange = (key: string, value: string) => {
    setEditedTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
    setUnsavedChanges(true);
  };

  const handleImageChange = (key: string, value: string) => {
    setEditedTheme(prev => ({
      ...prev,
      images: { ...prev.images, [key]: value },
    }));
    setUnsavedChanges(true);
  };

  const handleFieldDelete = (type: 'strings' | 'colors' | 'images', key: string) => {
    setEditedTheme(prev => {
      const newTheme = { ...prev };
      const section = { ...prev[type] };
      delete section[key];
      newTheme[type] = section;
      return newTheme;
    });
    setUnsavedChanges(true);
  };

  const handleAddField = (type: 'strings' | 'colors' | 'images', key: string, value: string) => {
    setEditedTheme(prev => ({
      ...prev,
      [type]: { ...prev[type], [key]: value },
    }));
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    await updateTheme(editedTheme);
    setUnsavedChanges(false);
  };

  const getCurrentSection = () => {
    switch (activeTab) {
      case 0:
        return 'strings';
      case 1:
        return 'colors';
      case 2:
        return 'images';
      default:
        return 'strings';
    }
  };

  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4">Theme Editor</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isLoading || !unsavedChanges}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} className="mb-4">
        <Tab label="Strings" />
        {/* <Tab label="Colors" />
        <Tab label="Images" /> */}
      </Tabs>

      <Box className="mb-4 flex justify-end">
        <Button
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          variant="outlined"
        >
          Add {getCurrentSection().slice(0, -1)}
        </Button>
      </Box>

      <Box className="mt-4 max-h-[500px] overflow-auto">
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {Object.entries(editedTheme.strings).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Card>
                  <CardContent>
                    <Box className="flex justify-between items-center mb-2">
                      <Typography variant="subtitle2" color="textSecondary">
                        {key}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleFieldDelete('strings', key)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <TextField
                      fullWidth
                      value={value}
                      onChange={(e) => handleStringChange(key, e.target.value)}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {Object.entries(editedTheme.colors).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Card>
                  <CardContent>
                    <Box className="flex justify-between items-center mb-2">
                      <Typography>{key}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleFieldDelete('colors', key)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box
                      className="w-full h-12 rounded cursor-pointer mb-2"
                      style={{ backgroundColor: value }}
                      onClick={() => setSelectedColor(key)}
                    />
                    {selectedColor === key && (
                      <SketchPicker
                        color={value}
                        onChange={(color) => handleColorChange(key, color.hex)}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            {Object.entries(editedTheme.images).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Card>
                  <CardContent>
                    <Box className="flex justify-between items-center mb-2">
                      <Typography variant="subtitle2" color="textSecondary">
                        {key}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleFieldDelete('images', key)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <TextField
                      fullWidth
                      value={value}
                      onChange={(e) => handleImageChange(key, e.target.value)}
                    />
                    <img
                      src={value}
                      alt={key}
                      className="mt-2 max-w-full h-auto"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <AddFieldDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={(key, value) => handleAddField(getCurrentSection(), key, value)}
        type={getCurrentSection()}
      />
    </Box>
  );
};