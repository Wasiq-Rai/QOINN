'use client'
import { useUser } from '@clerk/nextjs';
import { Avatar, Typography, Paper, Grid, Divider, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Email, Phone, VerifiedUser, Person, CalendarToday, Lock } from '@mui/icons-material';

export default function UserProfile() {
  const { user } = useUser();

  if (!user) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Paper className="p-6 max-w-4xl mx-auto" elevation={3}>
        {/* Header Section */}
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Avatar
              src={user.imageUrl}
              alt={user.fullName || 'User'}
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h4" className="font-bold">
              {user.fullName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {user.primaryEmailAddress?.emailAddress}
            </Typography>
            <Chip
              label="Verified"
              color="success"
              size="small"
              icon={<VerifiedUser fontSize="small" />}
              className="mt-2"
            />
          </Grid>
        </Grid>

        <Divider className="my-6" />

        {/* Personal Information Section */}
        <Typography variant="h6" className="mb-4 font-semibold">
          Personal Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Full Name" secondary={user.fullName} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={user.primaryEmailAddress?.emailAddress}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText
                  primary="Phone Number"
                  secondary={user.primaryPhoneNumber?.phoneNumber || 'Not provided'}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText
                  primary="Account Created"
                  secondary={new Date(user.createdAt || Date.now()).toLocaleDateString()}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Lock />
                </ListItemIcon>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary={user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider className="my-6" />

        {/* External Accounts Section */}
        <Typography variant="h6" className="mb-4 font-semibold">
          Connected Accounts
        </Typography>
        <List>
          {user.externalAccounts.map((account) => (
            <ListItem key={account.id}>
              <ListItemIcon>
                <Avatar
                  src={account.imageUrl}
                  alt={account.provider}
                  sx={{ width: 40, height: 40 }}
                />
              </ListItemIcon>
              <ListItemText
                primary={`${account.firstName} ${account.lastName}`}
                secondary={`Connected via ${account.provider}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
}