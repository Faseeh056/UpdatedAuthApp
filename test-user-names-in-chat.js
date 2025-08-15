import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration matching Docker setup
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5433,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'auth_chat_db',
  ssl: false
};

console.log('Testing user names in chat messages...');
console.log('Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

// Create PostgreSQL connection pool
const pool = new Pool(dbConfig);

async function testUserNamesInChat() {
  try {
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Get all users
    const users = await client.query('SELECT id, name, email FROM users ORDER BY created_at DESC');
    
    if (users.rows.length === 0) {
      console.log('❌ No users found in database!');
      return;
    }
    
    console.log(`\n👥 Users in database: ${users.rows.length}`);
    users.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email})`);
    });
    
    // Get all chat sessions
    const sessions = await client.query(`
      SELECT cs.id, cs.title, cs.created_at, u.name as user_name
      FROM chat_sessions cs
      JOIN users u ON cs.user_id = u.id
      ORDER BY cs.updated_at DESC
    `);
    
    console.log(`\n💬 Chat sessions: ${sessions.rows.length}`);
    
    if (sessions.rows.length === 0) {
      console.log('  No chat sessions found');
      return;
    }
    
    // Show messages for each session
    for (const session of sessions.rows) {
      console.log(`\n📝 Session: ${session.title} (User: ${session.user_name})`);
      
      const messages = await client.query(`
        SELECT id, role, content, timestamp
        FROM chat_messages
        WHERE session_id = $1
        ORDER BY timestamp
      `, [session.id]);
      
      console.log(`  Messages: ${messages.rows.length}`);
      
      messages.rows.forEach((msg, index) => {
        const content = msg.content.length > 60 ? msg.content.substring(0, 60) + '...' : msg.content;
        const isUserMessage = msg.role !== 'assistant';
        const roleDisplay = isUserMessage ? `👤 ${msg.role}` : `🤖 ${msg.role}`;
        
        console.log(`    ${index + 1}. ${roleDisplay} - ${content}`);
        console.log(`        Time: ${msg.timestamp}`);
      });
    }
    
    // Test creating a new session with user names in role column
    console.log('\n🧪 Testing new session with user names in role column...');
    
    const testUser = users.rows[0];
    console.log(`  Using test user: ${testUser.name}`);
    
    // Create a new session
    const newSession = await client.query(`
      INSERT INTO chat_sessions (user_id, title, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id, title
    `, [testUser.id, 'Test Session with User Names']);
    
    const sessionId = newSession.rows[0].id;
    console.log(`  ✅ Created session: ${newSession.rows[0].title} (${sessionId})`);
    
    // Add test messages with user names in role column
    const testMessages = [
      { role: testUser.name, content: 'Hello, this is a test message from the user.' },
      { role: 'assistant', content: 'Hello! This is a test response from the AI assistant.' },
      { role: testUser.name, content: 'How are you doing today?' },
      { role: 'assistant', content: 'I\'m doing great, thank you for asking! How can I help you today?' },
      { role: testUser.name, content: 'Can you help me with programming?' },
      { role: 'assistant', content: 'Of course! I\'d be happy to help you with programming. What specific language or concept would you like to learn about?' }
    ];
    
    for (const msg of testMessages) {
      await client.query(`
        INSERT INTO chat_messages (session_id, role, content, timestamp)
        VALUES ($1, $2, $3, NOW())
      `, [sessionId, msg.role, msg.content]);
    }
    
    console.log(`  ✅ Added ${testMessages.length} test messages with user names in role column`);
    
    // Verify the messages were stored correctly
    const storedMessages = await client.query(`
      SELECT role, content, timestamp 
      FROM chat_messages 
      WHERE session_id = $1 
      ORDER BY timestamp
    `, [sessionId]);
    
    console.log(`\n✅ Verification - Stored messages with user names: ${storedMessages.rows.length}`);
    storedMessages.rows.forEach((msg, index) => {
      const content = msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content;
      const isUserMessage = msg.role !== 'assistant';
      const roleDisplay = isUserMessage ? `👤 ${msg.role}` : `🤖 ${msg.role}`;
      
      console.log(`  ${index + 1}. ${roleDisplay} - ${content}`);
    });
    
    // Show total message count
    const totalMessages = await client.query('SELECT COUNT(*) FROM chat_messages');
    console.log(`\n📊 Total messages in database: ${totalMessages.rows[0].count}`);
    
    // Show unique roles (should include user names)
    const uniqueRoles = await client.query(`
      SELECT DISTINCT role, COUNT(*) as count
      FROM chat_messages
      GROUP BY role
      ORDER BY count DESC
    `);
    
    console.log(`\n🎭 Unique roles in chat_messages table:`);
    uniqueRoles.rows.forEach(row => {
      const isUserMessage = row.role !== 'assistant';
      const roleDisplay = isUserMessage ? `👤 ${row.role}` : `🤖 ${row.role}`;
      console.log(`  ${roleDisplay}: ${row.count} messages`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testUserNamesInChat();
