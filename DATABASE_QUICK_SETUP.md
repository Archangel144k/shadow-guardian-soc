# 🚀 Shadow Guardian Database Setup Guide

## Quick Setup Instructions

### Step 1: Create Database Tables
1. **Open the Supabase SQL Editor**: https://supabase.com/dashboard/project/qrgbhlujkjfbqvcybxbl/sql/new
2. **Copy the contents** of `/database/create-tables.sql` 
3. **Paste into the SQL Editor** and click "Run"
4. ✅ **Verify**: You should see "Success. No rows returned" for each table creation

### Step 2: Populate with Sample Data
1. **In the same SQL Editor**, clear the previous query
2. **Copy the contents** of `/database/populate-data.sql`
3. **Paste and Run** the population script
4. ✅ **Verify**: You should see "Success. X rows affected" messages

### Step 3: Test the Application
1. **Start the development server**: `npm run dev`
2. **Open**: http://localhost:5173
3. ✅ **Verify**: The SOC dashboard should show live data instead of demo data

---

## What Gets Created

### 📊 Database Tables (6 total)
- **user_profiles** - User account information and clearance levels
- **security_threats** - Detected threats and incidents 
- **security_tools** - SOC tools and their status
- **training_modules** - Cybersecurity training content
- **user_progress** - Training completion tracking
- **system_metrics** - Performance and security metrics

### 🛡️ Security Features
- **Row Level Security (RLS)** enabled on all tables
- **Access policies** for proper data isolation
- **Automated triggers** for timestamp updates
- **Data validation** with CHECK constraints

### 📈 Sample Data Includes
- **8 Security Tools** (Suricata, Elasticsearch, Wazuh, etc.)
- **6 Training Modules** (Threat Hunting, Incident Response, etc.)
- **6 Security Threats** (Malware, DDoS, Phishing, etc.)
- **10 System Metrics** (Detection rates, performance stats, etc.)

---

## Troubleshooting

### ❌ If Table Creation Fails
- **Check permissions**: You need `CREATE` privileges
- **Try one table at a time**: Copy individual `CREATE TABLE` statements
- **Contact Supabase support** if permissions are restricted

### ❌ If Data Population Fails
- **Ensure tables exist first**: Run the create-tables.sql script first
- **Check for foreign key errors**: User profiles must exist before other data
- **Try smaller batches**: Insert data in smaller chunks if needed

### ❌ If Application Still Shows Demo Mode
- **Clear browser cache**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- **Check console errors**: Open browser developer tools
- **Verify environment variables**: Ensure .env file has correct Supabase credentials

---

## Database Schema Overview

```
user_profiles (Base user data)
├── security_threats (Threats assigned to users)
├── security_tools (Tools managed by users)
├── training_modules (Created by users)
├── user_progress (User training progress)
└── system_metrics (System-wide metrics)
```

---

## Next Steps After Setup

1. **🔐 Authentication**: The app will work with Supabase Auth
2. **👥 User Management**: Create user profiles through the app
3. **📊 Real-time Data**: All data updates in real-time via Supabase
4. **🎯 Customization**: Modify the sample data to match your needs
5. **📈 Scaling**: Add more security tools, threats, and training content

---

## Files Reference

- 📄 **create-tables.sql** - Complete database schema
- 📄 **populate-data.sql** - Sample data for testing
- 📄 **schema.sql** - Detailed documentation (reference only)
- 📄 **sample-data.sql** - Extended sample data (reference only)

**🎉 Your Shadow Guardian SOC platform will be fully operational after these steps!**
