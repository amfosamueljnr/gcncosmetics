import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function AdminCategories() {
  const { categories, products, loading, error, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const openNew = () => {
    setEditingSlug(null);
    setName("");
    setSlug("");
    setDialogOpen(true);
  };

  const openEdit = (cat: { name: string; slug: string }) => {
    setEditingSlug(cat.slug);
    setName(cat.name);
    setSlug(cat.slug);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) {
      toast({ title: "Name and slug are required", variant: "destructive" });
      return;
    }
    try {
      if (editingSlug) {
        await updateCategory(editingSlug, { name, slug });
        toast({ title: "Category updated" });
      } else {
        await addCategory({ name, slug });
        toast({ title: "Category created" });
      }
      setDialogOpen(false);
    } catch (err) {
      toast({ title: "Unable to save category", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    }
  };

  const handleDelete = async (catSlug: string) => {
    try {
      await deleteCategory(catSlug);
      toast({ title: "Category deleted" });
    } catch (err) {
      toast({ title: "Unable to delete category", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    }
  };

  const getProductCount = (catSlug: string) => products.filter((p) => p.category === catSlug).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
          <p className="font-body text-sm text-muted-foreground">{categories.length} categories</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-display">{editingSlug ? "Edit Category" : "New Category"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => { setName(e.target.value); if (!editingSlug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); }} />
              </div>
              <div className="grid gap-2">
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading categories...</TableCell>
              </TableRow>
            )}
            {!loading && error && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-destructive">{error}</TableCell>
              </TableRow>
            )}
            {!loading && !error && categories.map((c) => (
              <TableRow key={c.slug}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                <TableCell>{getProductCount(c.slug)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.slug)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && !error && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No categories found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
