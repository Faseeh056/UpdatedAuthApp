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

console.log('Testing chat message storage...');
console.log('Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

// Create PostgreSQL connection pool
const pool = new Pool(dbConfig);

async function testChatStorage() {
  try {
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Check if chat tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('chat_sessions', 'chat_messages', 'users')
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Chat-related tables:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    if (tables.rows.length < 3) {
      console.log('❌ Missing required chat tables!');
      return;
    }
    
    // Get user for testing
    const users = await client.query('SELECT id, name, email FROM users LIMIT 1');
    
    if (users.rows.length === 0) {
      console.log('❌ No users found in database!');
      return;
    }
    
    const testUser = users.rows[0];
    console.log(`\n👤 Using test user: ${testUser.name} (${testUser.email})`);
    
    // Check existing chat sessions
    const sessions = await client.query(`
      SELECT id, title, created_at, updated_at 
      FROM chat_sessions 
      WHERE user_id = $1 
      ORDER BY updated_at DESC
    `, [testUser.id]);
    
    console.log(`\n💬 Chat sessions for user: ${sessions.rows.length}`);
    
    if (sessions.rows.length > 0) {
      const latestSession = sessions.rows[0];
      console.log(`  Latest session: ${latestSession.title} (${latestSession.id})`);
      
      // Get messages for this session
      const messages = await client.query(`
        SELECT id, role, content, timestamp 
        FROM chat_messages 
        WHERE session_id = $1 
        ORDER BY timestamp
      `, [latestSession.id]);
      
      console.log(`\n📝 Messages in latest session: ${messages.rows.length}`);
      
      messages.rows.forEach((msg, index) => {
        const content = msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content;
        console.log(`  ${index + 1}. [${msg.role}] ${content} (${msg.timestamp})`);
      });
      
      // Show messages with user info
      const messagesWithUser = await client.query(`
        SELECT 
          cm.id,
          cm.role,
          cm.content,
          cm.timestamp,
          u.name as user_name
        FROM chat_messages cm
        JOIN chat_sessions cs ON cm.session_id = cs.id
        JOIN users u ON cs.user_id = u.id
        WHERE cs.id = $1
        ORDER BY cm.timestamp
      `, [latestSession.id]);
      
      console.log(`\n👥 Messages with user info: ${messagesWithUser.rows.length}`);
      
      messagesWithUser.rows.forEach((msg, index) => {
        const content = msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content;
        console.log(`  ${index + 1}. [${msg.role}] ${content} - User: ${msg.user_name} (${msg.timestamp})`);
      });
      
    } else {
      console.log('  No chat sessions found');
    }
    
    // Test creating a new session and messages
    console.log('\n🧪 Testing new session creation...');
    
    const newSession = await client.query(`
      INSERT INTO chat_sessions (user_id, title, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id, title
    `, [testUser.id, 'Test Session']);
    
    const sessionId = newSession.rows[0].id;
    console.log(`  ✅ Created session: ${newSession.rows[0].title} (${sessionId})`);
    
    // Add test messages
    const testMessages = [
      { role: 'user', content: 'Hello, this is a test message from the user.' },
      { role: 'assistant', content: 'Hello! This is a test response from the AI assistant.' },
      { role: 'user', content: 'How are you doing today?' },
      { role: 'assistant', content: 'I\'m doing great, thank you for asking! How can I help you today?' }
    ];
    
    for (const msg of testMessages) {
      await client.query(`
        INSERT INTO chat_messages (session_id, role, content, timestamp)
        VALUES ($1, $2, $3, NOW())
      `, [sessionId, msg.role, msg.content]);
    }
    
    console.log(`  ✅ Added ${testMessages.length} test messages`);
    
    // Verify the messages were stored
    const storedMessages = await client.query(`
      SELECT role, content, timestamp 
      FROM chat_messages 
      WHERE session_id = $1 
      ORDER BY timestamp
    `, [sessionId]);
    
    console.log(`\n✅ Verification - Stored messages: ${storedMessages.rows.length}`);
    storedMessages.rows.forEach((msg, index) => {
      const content = msg.content.length > 40 ? msg.content.substring(0, 40) + '...' : msg.content;
      console.log(`  ${index + 1}. [${msg.role}] ${content}`);
    });
    
    // Show total message count
    const totalMessages = await client.query('SELECT COUNT(*) FROM chat_messages');
    console.log(`\n📊 Total messages in database: ${totalMessages.rows[0].count}`);
    
    client.release();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testChatStorage();
