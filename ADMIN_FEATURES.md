# 🔐 Admin Features Documentation

## Admin Login
**URL**: `http://localhost:3000/admin`

**Credentials**:
- Email: `admin@village.com`
- Password: `Admin@123`

---

## 🎯 Admin Capabilities

The admin has **FULL CONTROL** over all user data and can delete anything in the system.

### 1. Dashboard Overview 📊
- Total users count
- Total jobs count
- Active jobs count
- Total resources
- Total chats
- Recent users (last 30 days)
- Top villages by user count
- Top skills

### 2. User Management 👥

#### View Users
- See all registered users
- View user details (name, email, phone, village, skills, status, join date)
- Check user activity status

#### Individual User Actions
- **Activate/Deactivate**: Toggle user account status
- **View Details**: See complete user profile with skills
- **Delete User**: Remove user and their jobs/chats
- **Delete User Skills**: Remove specific skills from user profile
- **Complete Purge**: Permanently delete all user data:
  - User account
  - All posted jobs
  - All chats (as poster and applicant)
  - All saved jobs references

#### Bulk User Actions
- **Select Multiple Users**: Use checkboxes to select users
- **Bulk Delete**: Delete multiple users at once with all their data
- **Clear Selection**: Deselect all users

### 3. Job Management 💼

#### View Jobs
- See all job listings
- View job details (title, posted by, village, salary, positions, status)
- Check job creation date

#### Individual Job Actions
- **Delete Job**: Remove job and related chats

#### Bulk Job Actions
- **Select Multiple Jobs**: Use checkboxes to select jobs
- **Bulk Delete**: Delete multiple jobs at once with related chats
- **Clear Selection**: Deselect all jobs

### 4. Chat Management 💬

#### View Chats
- See all chat conversations
- View participants (job poster and applicant)
- See message count
- Check last update time

#### Chat Actions
- **Delete Chat**: Remove entire conversation

---

## 🔧 API Endpoints

### User Management
```
GET    /api/admin/users              - Get all users
GET    /api/admin/users/:id          - Get specific user
PUT    /api/admin/users/:id          - Update user data
PATCH  /api/admin/users/:id/status   - Toggle user status
DELETE /api/admin/users/:id          - Delete user
DELETE /api/admin/users/:userId/skills/:skillId          - Delete user skill
DELETE /api/admin/users/:userId/saved-jobs/:jobId        - Remove saved job
POST   /api/admin/users/purge/:id                        - Complete data purge
POST   /api/admin/users/bulk-delete                      - Bulk delete users
```

### Job Management
```
GET    /api/admin/jobs               - Get all jobs
DELETE /api/admin/jobs/:id           - Delete job
POST   /api/admin/jobs/bulk-delete   - Bulk delete jobs
```

### Chat Management
```
GET    /api/admin/chats              - Get all chats
DELETE /api/admin/chats/:id          - Delete chat
```

### Statistics
```
GET    /api/admin/stats              - Get dashboard statistics
```

---

## 🎨 Admin Dashboard Interface

### Tabs
1. **📊 Overview**: Statistics and insights
2. **👥 Users**: User management with actions
3. **💼 Jobs**: Job listings with delete options
4. **💬 Chats**: All conversations

### User Actions Menu
- 🔓/🔒 Activate/Deactivate toggle
- 👁️ View details
- 🗑️ Delete user

### User Details Modal
- Complete user information
- Skills list with individual delete buttons
- **⚠️ Complete Purge** button (red, dangerous action)

### Bulk Actions Bar
- Shows selected count
- **🗑️ Delete Selected** button
- **Clear Selection** button

---

## 🚨 Delete Options Explained

### 1. Regular Delete User
**What it deletes**:
- User account
- Jobs posted by user
- Chats involving user

**Use when**: You want to remove a user and their content

### 2. Complete Purge
**What it deletes**:
- User account
- Jobs posted by user
- Chats involving user
- User's saved jobs references in other users' profiles

**Use when**: You want to completely erase all traces of a user

### 3. Delete User Skill
**What it deletes**:
- Single skill from user's profile

**Use when**: User has inappropriate or incorrect skill

### 4. Delete Job
**What it deletes**:
- Job listing
- Related chats

**Use when**: Job is inappropriate or no longer needed

### 5. Delete Chat
**What it deletes**:
- Entire conversation between two users

**Use when**: Chat contains inappropriate content

### 6. Bulk Delete Users
**What it deletes**:
- Multiple user accounts
- All their jobs
- All their chats

**Use when**: Need to remove multiple users at once

### 7. Bulk Delete Jobs
**What it deletes**:
- Multiple job listings
- All related chats

**Use when**: Need to remove multiple jobs at once

---

## ⚠️ Important Notes

### Before Deleting
- All delete actions show confirmation dialogs
- **Deleted data cannot be recovered**
- Consider deactivating instead of deleting
- Bulk deletes are permanent

### Best Practices
1. **Deactivate First**: Try deactivating users before deleting
2. **Review Data**: Check user details before purging
3. **Backup**: Consider backing up important data
4. **Confirm**: Always read confirmation messages carefully
5. **Monitor**: Keep track of deleted data in logs

### Security
- Admin actions are logged
- Only users with `isAdmin: true` can access
- All routes protected with authentication
- JWT token required for all admin APIs

---

## 🎯 Common Admin Tasks

### Removing Spam User
1. Go to Users tab
2. Find the user
3. Click 👁️ to view details
4. Click 🗑️ to delete
5. Confirm deletion

### Cleaning Up Old Jobs
1. Go to Jobs tab
2. Select jobs using checkboxes
3. Click "🗑️ Delete Selected"
4. Confirm bulk deletion

### Removing Inappropriate Chat
1. Go to Chats tab
2. Find the chat
3. Click 🗑️ to delete
4. Confirm deletion

### Complete User Removal
1. Go to Users tab
2. Click 👁️ on user to view details
3. Click "⚠️ Complete Purge"
4. Read warning carefully
5. Confirm purge

### Removing User Skill
1. Go to Users tab
2. Click 👁️ on user
3. In skills list, click × on skill
4. Confirm removal

---

## 📱 UI Features

### Visual Indicators
- **Green status badge**: Active user/job
- **Red status badge**: Inactive user/job
- **Success message**: Green background
- **Error message**: Red background
- **Selected rows**: Highlighted
- **Hover effects**: Interactive elements change on hover

### Animations
- Smooth fade-in for content
- Slide-in for messages
- Scale effect on button hover
- Color transitions

### Responsive Design
- Works on desktop and tablet
- Scrollable tables on mobile
- Touch-friendly buttons

---

## 🔍 Troubleshooting

### Can't Access Admin Dashboard
**Solution**: Ensure you're logged in with admin account

### Delete Button Not Working
**Solution**: Check if backend server is running

### No Users/Jobs Showing
**Solution**: Check database connection

### Bulk Delete Not Working
**Solution**: Make sure you've selected items with checkboxes

---

## 📞 Support

For issues or questions about admin features:
- Check server logs in backend terminal
- Verify admin token is valid
- Ensure MongoDB is running
- Check browser console for errors

---

**⚠️ Remember**: With great power comes great responsibility. Use admin features carefully!
