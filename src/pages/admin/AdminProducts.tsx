import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/services/products";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "",
  gender: "unisex",
  price: 0,
  description: "",
  materials: "",
  deliveryInfo: "Standard delivery: 5-7 business days.",
  images: [],
  sizes: [],
  colors: [],
  isFeatured: false,
  isNewArrival: false,
  stockStatus: "in-stock",
  stock: 0,
  style: "",
  status: "draft",
};

export default function AdminProducts() {
  const { products, categories, loading, error, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyProduct, category: categories[0]?.slug ?? "" });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    try {
      if (editing) {
        await updateProduct(editing.id, form);
        toast({ title: "Product updated" });
      } else {
        await addProduct(form);
        toast({ title: "Product created" });
      }
      setDialogOpen(false);
    } catch (err) {
      toast({ title: "Unable to save product", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteProduct(id);
      toast({ title: "Product deleted", description: name });
    } catch (err) {
      toast({ title: "Unable to delete product", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    }
  };

  const updateField = <K extends keyof Omit<Product, "id">>(key: K, value: Omit<Product, "id">[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          updateField("images", [...form.images, result]);
          toast({ title: "Image uploaded", description: file.name });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    updateField("images", form.images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
          <p className="font-body text-sm text-muted-foreground">{products.length} total products</p>
        </div>
        <div className="flex items-center gap-3">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="w-56" />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">{editing ? "Edit Product" : "New Product"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm font-medium">Click to upload images or drag and drop</span>
                      <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</span>
                    </label>
                  </div>
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Product ${idx + 1}`} className="w-full h-24 rounded-md object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Price (GH₵)</Label>
                    <Input type="number" value={form.price} onChange={(e) => updateField("price", Number(e.target.value))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Discount Price (GH₵)</Label>
                    <Input type="number" value={form.discountPrice || ""} onChange={(e) => updateField("discountPrice", e.target.value ? Number(e.target.value) : undefined)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Gender</Label>
                    <Select value={form.gender} onValueChange={(v) => updateField("gender", v as Product["gender"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Materials</Label>
                  <Textarea rows={2} value={form.materials} onChange={(e) => updateField("materials", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Volumes (comma-separated, e.g. 30ml, 50ml)</Label>
                    <Input value={form.sizes.join(", ")} onChange={(e) => updateField("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Colors (comma-separated)</Label>
                    <Input value={form.colors.join(", ")} onChange={(e) => updateField("colors", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Stock</Label>
                    <Input type="number" value={form.stock} onChange={(e) => updateField("stock", Number(e.target.value))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Style</Label>
                    <Select value={form.style} onValueChange={(v) => updateField("style", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="contemporary">Contemporary</SelectItem>
                        <SelectItem value="artisanal">Artisanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch checked={form.isFeatured} onCheckedChange={(v) => updateField("isFeatured", v)} />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={form.isNewArrival} onCheckedChange={(v) => updateField("isNewArrival", v)} />
                    <Label>New Arrival</Label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Visibility</Label>
                  <Select value={form.status} onValueChange={(v) => updateField("status", v as Product["status"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>{editing ? "Save Changes" : "Create Product"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading products...</TableCell>
              </TableRow>
            )}
            {!loading && error && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-destructive">{error}</TableCell>
              </TableRow>
            )}
            {!loading && !error && filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {p.images[0] && (
                      <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                    )}
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="font-body text-xs text-muted-foreground md:hidden capitalize">{p.category}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell capitalize text-muted-foreground">{p.category}</TableCell>
                <TableCell className="font-semibold">GH₵{p.price.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={p.stock <= 5 ? "text-destructive font-medium" : "text-muted-foreground"}>{p.stock}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={p.status === "published" ? "default" : "secondary"} className="gap-1">
                    {p.status === "published" ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {p.status === "published" ? "Live" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id, p.name)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && !error && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
