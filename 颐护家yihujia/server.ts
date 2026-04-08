import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Supabase Client (Server-side)
const DEFAULT_URL = "https://fiwgairrhbqfyasihbhc.supabase.co";
const DEFAULT_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpd2dhaXJyaGJxZnlhc2loYmhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM4NDM3MSwiZXhwIjoyMDkwOTYwMzcxfQ.gulKfJUQ5zpCSDkOTdPoIwc6uUr5Qt55dGyZhql1Ye0";

const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_KEY;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Using default Supabase credentials. For production, please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment settings.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// In-memory fallback for orders (for demo/development if DB fails)
let tempOrders: any[] = [];
let tempAddresses: any[] = [];
let tempMedications: any[] = [];
let tempHealthRecords: any[] = [];

app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Fetch articles from Supabase
app.get("/api/articles", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database service unavailable" });
  }
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch health records for a specific user
app.get("/api/health-records/:userId", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database service unavailable" });
  }
  const { userId } = req.params;
  try {
    const { data, error } = await supabase
      .from("health_records")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new health record
app.post("/api/health-records", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database service unavailable" });
  }
  try {
    const { user_id, type, value, unit, status, date } = req.body;
    const { data, error } = await supabase
      .from("health_records")
      .insert([{ user_id, type, value, unit, status, date }])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch orders for a specific user
app.get("/api/orders/:userId", async (req, res) => {
  const { userId } = req.params;
  
  let dbOrders: any[] = [];
  let dbError = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.warn('Supabase fetch orders error:', error.message);
        dbError = error;
      } else {
        dbOrders = data || [];
      }
    } catch (err) {
      console.error('Supabase fetch orders exception:', err);
    }
  }

  // Merge with in-memory orders for this user
  const userTempOrders = tempOrders.filter(o => o.user_id === userId);
  const allOrders = [...userTempOrders, ...dbOrders].sort((a, b) => 
    new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime()
  );

  res.json(allOrders);
});

// Add a new order
app.post("/api/orders", async (req, res) => {
  const { user_id, service, time, address, status, price, statusLabel } = req.body;
  
  // Validate required fields
  if (!user_id || !service || !time || !address || !status || !price || !statusLabel) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newOrder = {
    id: Math.random().toString(36).substring(2, 15),
    user_id,
    service,
    time,
    address,
    status,
    price,
    statusLabel,
    created_at: new Date().toISOString()
  };

  console.log('Attempting to create order:', { user_id, service, time });

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([{ 
          user_id, 
          service, 
          time, 
          address, 
          status, 
          price, 
          statusLabel 
        }])
        .select();

      if (!error && data && data.length > 0) {
        console.log('Order saved to Supabase successfully');
        return res.json(data[0]);
      }

      console.error('Supabase Order Insert Error:', error?.message || 'Unknown error');
      
      // Fallback to in-memory store if DB fails
      console.log('Using in-memory fallback for order');
      tempOrders.unshift(newOrder);
      return res.json(newOrder);

    } catch (err: any) {
      console.error('Order Creation Exception:', err);
      tempOrders.unshift(newOrder);
      return res.json(newOrder);
    }
  } else {
    console.log('Supabase not available, using in-memory fallback');
    tempOrders.unshift(newOrder);
    return res.json(newOrder);
  }
});

// Fetch addresses for a specific user
app.get("/api/addresses/:userId", async (req, res) => {
  const { userId } = req.params;
  
  let dbAddresses: any[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false });
      
      if (!error) {
        dbAddresses = data || [];
      }
    } catch (err) {
      console.error('Supabase fetch addresses exception:', err);
    }
  }

  const userTempAddresses = tempAddresses.filter(a => a.user_id === userId);
  res.json([...userTempAddresses, ...dbAddresses]);
});

// Add a new address
app.post("/api/addresses", async (req, res) => {
  const { user_id, name, phone, address, is_default } = req.body;
  
  if (!user_id || !name || !phone || !address) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newAddr = {
    id: Math.random().toString(36).substring(2, 15),
    user_id,
    name,
    phone,
    address,
    is_default,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      // If setting as default, unset others
      if (is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user_id);
      }

      const { data, error } = await supabase
        .from("addresses")
        .insert([{ user_id, name, phone, address, is_default }])
        .select();

      if (!error && data && data.length > 0) {
        return res.json(data[0]);
      }
    } catch (err) {
      console.error('Address creation exception:', err);
    }
  }

  // Fallback
  if (is_default) {
    tempAddresses = tempAddresses.map(a => a.user_id === user_id ? { ...a, is_default: false } : a);
  }
  tempAddresses.push(newAddr);
  res.json(newAddr);
});

// Fetch medications for a specific user
app.get("/api/medications/:userId", async (req, res) => {
  const { userId } = req.params;
  
  let dbMeds: any[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (!error) {
        dbMeds = data || [];
      }
    } catch (err) {
      console.error('Supabase fetch medications exception:', err);
    }
  }

  const userTempMeds = tempMedications.filter(m => m.user_id === userId);
  res.json([...userTempMeds, ...dbMeds]);
});

// Add a new medication
app.post("/api/medications", async (req, res) => {
  const { user_id, name, dosage, status, nextTime, purpose, freq } = req.body;
  
  if (!user_id || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newMed = {
    id: Math.random().toString(36).substring(2, 15),
    user_id,
    name,
    dosage,
    status,
    nextTime,
    purpose,
    freq,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("medications")
        .insert([{ user_id, name, dosage, status, nextTime, purpose, freq }])
        .select();

      if (!error && data && data.length > 0) {
        return res.json(data[0]);
      }
    } catch (err) {
      console.error('Medication creation exception:', err);
    }
  }

  tempMedications.push(newMed);
  res.json(newMed);
});

// Fetch health records for a specific user
app.get("/api/health-records/:userId", async (req, res) => {
  const { userId } = req.params;
  
  let dbRecords: any[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("health_records")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });
      
      if (!error) {
        dbRecords = data || [];
      }
    } catch (err) {
      console.error('Supabase fetch health records exception:', err);
    }
  }

  const userTempRecords = tempHealthRecords.filter(r => r.user_id === userId);
  const allRecords = [...userTempRecords, ...dbRecords].sort((a, b) => 
    new Date(b.date || Date.now()).getTime() - new Date(a.date || Date.now()).getTime()
  );

  res.json(allRecords);
});

// Add a new health record
app.post("/api/health-records", async (req, res) => {
  const { user_id, type, value, unit, status, date } = req.body;
  
  if (!user_id || !type || !value) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newRecord = {
    id: Math.random().toString(36).substring(2, 15),
    user_id,
    type,
    value,
    unit,
    status,
    date: date || new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("health_records")
        .insert([{ user_id, type, value, unit, status, date }])
        .select();

      if (!error && data && data.length > 0) {
        return res.json(data[0]);
      }
    } catch (err) {
      console.error('Health record creation exception:', err);
    }
  }

  tempHealthRecords.unshift(newRecord);
  res.json(newRecord);
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

/*
SUPABASE SCHEMA (SQL):

-- Articles Table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  quick_take JSONB,
  content TEXT,
  image TEXT,
  category TEXT,
  read_time TEXT,
  date DATE DEFAULT CURRENT_DATE,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMEZONE()
);

-- Health Records Table
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Removed REFERENCES auth.users(id) for demo compatibility
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  status TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Removed REFERENCES auth.users(id) for demo compatibility
  service TEXT NOT NULL,
  time TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL,
  statusLabel TEXT NOT NULL,
  price TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Addresses Table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Removed REFERENCES auth.users(id) for demo compatibility
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medications Table
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  status TEXT NOT NULL,
  nextTime TEXT,
  purpose TEXT,
  freq TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS Policies (Example)
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own records" ON health_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own records" ON health_records FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own medications" ON medications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own medications" ON medications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own medications" ON medications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own medications" ON medications FOR DELETE USING (auth.uid() = user_id);
*/
