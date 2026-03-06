import Link from 'next/link';
import { getCurrentUser } from './lib/auth';
import { db, schema } from './lib/db';
import { eq, sql } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Users, Eye, Database, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

async function getStats() {
  if (!db) {
    return { totalVisits: 0, totalUsers: 0 };
  }

  try {
    const [visitResult] = await db
      .select({ count: sql<number>`COALESCE(SUM(${schema.pageVisits.count}), 0)` })
      .from(schema.pageVisits)
      .where(eq(schema.pageVisits.page, 'home'));

    const [userResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(schema.users);

    return {
      totalVisits: visitResult?.count || 0,
      totalUsers: userResult?.count || 0,
    };
  } catch {
    return { totalVisits: 0, totalUsers: 0 };
  }
}

async function checkDbConnection() {
  if (!db) return false;
  try {
    await db.select({ one: sql`1` });
    return true;
  } catch {
    return false;
  }
}

async function incrementVisit() {
  if (!db) return;

  try {
    const [existing] = await db
      .select()
      .from(schema.pageVisits)
      .where(eq(schema.pageVisits.page, 'home'))
      .limit(1);

    if (existing) {
      await db
        .update(schema.pageVisits)
        .set({
          count: existing.count + 1,
          lastVisit: new Date(),
        })
        .where(eq(schema.pageVisits.id, existing.id));
    } else {
      await db.insert(schema.pageVisits).values({
        page: 'home',
        count: 1,
      });
    }
  } catch {
    // Silently fail for visit tracking
  }
}

export default async function HomePage() {
  const user = await getCurrentUser();
  const stats = await getStats();
  const dbConnected = await checkDbConnection();
  
  incrementVisit();

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Neon Database Template
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A simple Next.js starter with Neon Postgres and authentication
        </p>
        {!user && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/*
            <Link href="/register">
              <Button size="lg" className="gap-2">
                <Users className="w-4 h-4" />
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="gap-2">
                Sign In
              </Button>
            </Link>
            */}
            <a
              href="https://github.com/TencentEdgeOne/pages-templates"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-6 h-[44px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
            <a
              href="https://edgeone.ai/pages/new?template=neon-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-[44px] transition-transform hover:scale-105"
            >
              <img 
                src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" 
                alt="Deploy to EdgeOne Pages" 
                className="h-[44px] w-auto rounded-lg" 
              />
            </a>
          </div>
        )}
      </div>

      {/* DB Connection Status */}
      <div className="max-w-3xl mx-auto mb-8">
        <Card className={dbConnected ? 'border-green-200 dark:border-green-800' : 'border-amber-200 dark:border-amber-800'}>
          <CardContent className="flex items-center gap-4 py-4">
            <div className={`p-2 rounded-full ${dbConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
              <Database className={`h-5 w-5 ${dbConnected ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Database Status</span>
                {dbConnected ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {dbConnected 
                  ? 'Connected to Neon Postgres' 
                  : 'Not connected. Follow the steps below to set up your database.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Guide - Show when DB not connected */}
      {!dbConnected && (
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">Database Setup Guide</span>
              </CardTitle>
              <CardDescription>Follow these steps to connect your Neon database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center justify-center">1</span>
                  <div>
                    <p className="font-medium">Create a Neon account</p>
                    <p className="text-sm text-muted-foreground">
                      Go to{' '}
                      <a href="https://console.neon.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                        console.neon.tech <ExternalLink className="h-3 w-3" />
                      </a>{' '}
                      and sign up for free
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center justify-center">2</span>
                  <div>
                    <p className="font-medium">Create a new project</p>
                    <p className="text-sm text-muted-foreground">Create a project and copy the connection string</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center justify-center">3</span>
                  <div>
                    <p className="font-medium">Configure environment</p>
                    <p className="text-sm text-muted-foreground">Create <code className="bg-muted px-1 py-0.5 rounded">.env</code> file and add: <code className="bg-muted px-1 py-0.5 rounded">DATABASE_URL=your-connection-string</code></p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center justify-center">4</span>
                  <div>
                    <p className="font-medium">Initialize database</p>
                    <p className="text-sm text-muted-foreground">Run: <code className="bg-muted px-1 py-0.5 rounded">pnpm db:push</code></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
        <Card className="overflow-hidden border-0 shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">{stats.totalVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Page views</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">User accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Authentication</CardTitle>
            <CardDescription>Email and password login</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Simple registration and login with secure password hashing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dark Mode</CardTitle>
            <CardDescription>Light and dark theme support</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Toggle between light and dark themes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Status */}
      {user && (
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="flex items-center justify-between py-6">
              <div>
                <p className="font-medium">Welcome back!</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <form action="/api/logout" method="post">
                <Button type="submit" variant="outline" size="sm">Sign Out</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
