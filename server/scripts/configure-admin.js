#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setUserRole, getUserRecord, isFirebaseConfigured } from '../config/firebaseAdmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    email: '',
    uid: '',
    role: 'admin',
    name: '',
    list: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--email' || arg === '-e') {
      options.email = args[++i] || '';
    } else if (arg === '--uid' || arg === '-u') {
      options.uid = args[++i] || '';
    } else if (arg === '--role' || arg === '-r') {
      options.role = args[++i] || 'admin';
    } else if (arg === '--name' || arg === '-n') {
      options.name = args[++i] || '';
    } else if (arg === '--list' || arg === '-l') {
      options.list = true;
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();
  const usersFile = path.resolve(__dirname, '../.data/users.json');

  console.log('\n======================================================');
  console.log('🛡️  Placement Genie - Administrator Account Manager');
  console.log('======================================================');

  if (options.list) {
    if (fs.existsSync(usersFile)) {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '{}');
      const userList = Object.values(users);
      console.log(`Found ${userList.length} configured account(s):\n`);
      userList.forEach((u, idx) => {
        console.log(`[${idx + 1}] Email: ${u.email || 'N/A'}`);
        console.log(`    UID:   ${u.uid}`);
        console.log(`    Role:  ${u.role?.toUpperCase()}`);
        console.log(`    Updated: ${u.updatedAt || 'N/A'}\n`);
      });
    } else {
      console.log('No user accounts configured yet.');
    }
    return;
  }

  if (!options.email && !options.uid) {
    console.log('\nUsage:');
    console.log('  node server/scripts/configure-admin.js --email <admin_email> [--uid <firebase_uid>] [--name <display_name>]');
    console.log('  node server/scripts/configure-admin.js --list\n');
    console.log('Examples:');
    console.log('  node server/scripts/configure-admin.js --email placement.officer@college.edu');
    console.log('  node server/scripts/configure-admin.js --email placement.officer@college.edu --uid firebase_uid_12345\n');
    console.log('Note: This sets the role to "admin" securely without storing any passwords in source code.\n');
    return;
  }

  const email = (options.email || '').trim().toLowerCase();
  let uid = (options.uid || '').trim();

  // If no UID supplied, check if account already exists in users.json or create consistent UID
  if (!uid) {
    const existing = await getUserRecord(null, email);
    if (existing?.uid) {
      uid = existing.uid;
      console.log(`ℹ️  Found existing account record for ${email} (UID: ${uid})`);
    } else {
      uid = `admin_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      console.log(`ℹ️  No Firebase UID passed. Using identifier: ${uid}`);
    }
  }

  const updatedRecord = await setUserRole(uid, {
    role: options.role || 'admin',
    email,
    displayName: options.name || 'Placement Administrator'
  });

  console.log('✅ Success! Role configured successfully:');
  console.log(`   Account Email:  ${updatedRecord.email}`);
  console.log(`   Account UID:    ${updatedRecord.uid}`);
  console.log(`   Assigned Role:  ${updatedRecord.role.toUpperCase()}`);
  console.log(`   Updated At:     ${updatedRecord.updatedAt}`);
  console.log('------------------------------------------------------');
  console.log('Storage Status:');
  console.log(`   Persistent Store: ${usersFile}`);
  console.log(`   Live Firestore:   ${isFirebaseConfigured ? 'Synchronized to users/' + uid : 'Offline emulation active'}`);
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('❌ Failed to configure admin account:', err);
  process.exit(1);
});
