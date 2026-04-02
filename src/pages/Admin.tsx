import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, TrendingUp,
  DollarSign, Eye, ArrowUpRight, Search, MoreHorizontal, Menu,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const STATS = [
  { label: 'Revenue', value: '$24,580', change: '+12.5%', icon: DollarSign },
  { label: 'Orders', value: '342', change: '+8.2%', icon: ShoppingCart },
  { label: 'Customers', value: '1,205', change: '+15.3%', icon: Users },
  { label: 'Page Views', value: '18.2K', change: '+22.1%', icon: Eye },
];

const RECENT_ORDERS = [
  { id: 'NC-7842', customer: 'Alex Johnson', product: 'Wireless Earbuds Pro', total: '$89.99', status: 'Shipped' },
  { id: 'NC-7841', customer: 'Maria Chen', product: 'Smart Home Hub', total: '$149.99', status: 'Processing' },
  { id: 'NC-7840', customer: 'James Wilson', product: 'LED Desk Lamp', total: '$34.99', status: 'Delivered' },
  { id: 'NC-7839', customer: 'Sara Ahmed', product: 'Fitness Tracker Band', total: '$59.99', status: 'Shipped' },
  { id: 'NC-7838', customer: 'Tom Baker', product: 'Portable Blender', total: '$44.99', status: 'Delivered' },
];

const TOP_PRODUCTS = [
  { name: 'Wireless Earbuds Pro', sold: 128, revenue: '$11,519' },
  { name: 'Smart Home Hub', sold: 85, revenue: '$12,749' },
  { name: 'Fitness Tracker Band', sold: 72, revenue: '$4,319' },
  { name: 'LED Desk Lamp', sold: 64, revenue: '$2,239' },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Products', icon: Package },
  { label: 'Orders', icon: ShoppingCart },
  { label: 'Customers', icon: Users },
  { label: 'Analytics', icon: TrendingUp },
];

const statusColor = (s: string) => {
  if (s === 'Delivered') return 'bg-success/10 text-success';
  if (s === 'Shipped') return 'bg-accent/10 text-accent';
  return 'bg-warning/10 text-warning';
};

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'
        } shrink-0 border-r border-border bg-card transition-all duration-300 md:w-60`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link to="/" className="font-display text-lg font-bold">
            <span className="text-gradient">Nova</span>Cart
          </Link>
          <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">Admin</span>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-display text-lg font-semibold text-foreground">Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="w-56 pl-10" />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                    <stat.icon className="h-4 w-4 text-accent" />
                  </div>
                </div>
                <p className="mt-2 font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change} vs last month
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Recent Orders */}
            <div className="rounded-xl border border-border bg-card lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h3 className="font-display text-base font-semibold text-foreground">Recent Orders</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Product</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_ORDERS.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell className="text-sm">{order.customer}</TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{order.product}</TableCell>
                      <TableCell className="text-sm font-medium">{order.total}</TableCell>
                      <TableCell>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Top Products */}
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border p-5">
                <h3 className="font-display text-base font-semibold text-foreground">Top Products</h3>
              </div>
              <div className="divide-y divide-border">
                {TOP_PRODUCTS.map((product, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{product.revenue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
